var express = require('express')
var router = express.Router()
var path = require('path')
var service = require('../services/service')


router.get('/', function (req, res, next) {
    var user = req.session.user
    if (user.permission && user.permission.contains('user')) {
        res.render('user', {}, function (err, output) {
                if (!err) {
                    res.json({
                        code: 200, content: output
                    })
                } else {
                    res.send({code: 400, msg: err.message})
                }
            }
        )
    } else {
        res.render('permission', {}, function (err, output) {
                if (!err) {
                    res.json({
                        code: 200, content: output
                    })
                } else {
                    res.send({code: 400, msg: err.message})
                }
            }
        )
    }

})


router.get('/login', function (req, res, next) {
    res.render('user-login')
})


router.post('/login', function (req, res, next) {
    req.session.regenerate(function () {
        var name = req.body.name
        var password = req.body.password
        if (name && password) {
            service.user_manager.findOne({name: name, password: password}, function (err, doc) {
                if (!err) {
                    var user = doc
                    req.session.user = user
                    res.send({code: 302, url: '/'})
                } else {
                    res.send({code: 400, msg: "帐号不存在"})
                }
            })
        } else {
            res.send({code: 400, msg: "登录失败"})
        }

    })
})


router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        res.send({code: 302, url: '/user/login'})
    })
})

router.post('/add', function (req, res, next) {
    var user = req.body
    if (user) {
        user.date = Date.now()
        if (!user.permission) user.permission = []
        service.user_manager.insert(user, function (err, doc) {
            if (!err) {
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "添加帐号失败"})
    }

})
router.post('/edit', function (req, res, next) {
    var user = req.body
    if (user) {
        if (!user.permission) user.permission = []
        service.user_manager.findAndModify({name: user.name}, user, function (err, doc) {
            if (!err) {
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "添加帐号失败"})
    }
})
router.post('/edit/phone', function (req, res, next) {
    var phone = req.body.phone
    if (phone) {
        service.user_manager.findAndModify({name: req.session.user.name}, {$set: {phone: phone}}, function (err, doc) {
            if (!err) {
                req.session.user.phone = phone
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "帐号或者密码不正确"})
    }
})

router.post('/edit/password', function (req, res, next) {
    var oldPassword = req.body.oldPassword
    var newPassword = req.body.newPassword
    if (oldPassword && newPassword) {
        service.user_manager.findAndModify({
            name: req.session.user.name,
            password: oldPassword
        }, {$set: {password: newPassword}}, function (err, doc) {
            if (!err) {
                req.session.user.password = newPassword
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "帐号或者密码不正确"})
    }
})

router.post('/delete', function (req, res, next) {
    var name = req.body.name
    if (name) {
        service.user_manager.remove({
            name: name
        }, function (err, doc) {
            if (!err) {
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "删除帐号失败"})
    }
})


router.get('/info', function (req, res, next) {
    res.render('user-info', {user: req.session.user}, function (err, output) {
            if (!err) {
                res.json({
                    code: 200, content: output
                })
            } else {
                res.send({code: 400, msg: err.message})
            }
        }
    )
})

router.get('/password', function (req, res, next) {
    res.render('user-password', {user: req.session.user}, function (err, output) {
            if (!err) {
                res.json({
                    code: 200, content: output
                })
            } else {
                res.send({code: 400, msg: err.message})
            }
        }
    )
})

router.get('/list', function (req, res, next) {
    service.user_manager.find({}, {sort: {type: 1, date: -1}}, function (err, doc) {
        if (!err) {
            res.render('user-list', {users: doc}, function (err, output) {
                    if (!err) {
                        res.json({
                            code: 200, content: output
                        })
                    } else {
                        res.send({code: 400, msg: err.message})
                    }

                }
            )
        } else {
            res.send({code: 400, msg: err.message})
        }

    })

})

module.exports = router
