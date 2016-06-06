var express = require('express')
var router = express.Router()
var path = require('path')
var service = require('../services/service')

var PAGE_SIZE = 5

router.get('/', function (req, res, next) {
    res.render('data', {}, function (err, output) {
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


router.get('/order', function (req, res, next) {
    service.order.count({state: 'completion'}, function (err, count) {
        if (!err) {
            service.order.find({state: 'completion'}, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                if (!err) {
                    res.render('data-order', {
                            count: Math.ceil(count / PAGE_SIZE),
                            orders: doc
                        }, function (err, output) {
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
        } else {
            res.send({code: 400, msg: err.message})
        }

    });

})

router.get('/order/content', function (req, res, next) {
    var index = req.query.index;
    service.order.find({state: 'completion'}, {
        sort: {date: -1},
        skip: (index - 1) * PAGE_SIZE,
        limit: PAGE_SIZE
    }, function (err, doc) {
        if (!err) {
            res.render('data-order-content', {
                    orders: doc
                }, function (err, output) {
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


router.get('/user', function (req, res, next) {
    service.user.count({state: 'completion'}, function (err, count) {
        if (!err) {
            service.user.find({}, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                if (!err) {
                    res.render('data-user', {
                            count: Math.ceil(count / PAGE_SIZE),
                            users: doc
                        }, function (err, output) {
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
        } else {
            res.send({code: 400, msg: err.message})
        }

    });

})

router.get('/user/content', function (req, res, next) {
    var index = req.query.index;
    service.user.find({}, {
        sort: {date: -1},
        skip: (index - 1) * PAGE_SIZE,
        limit: PAGE_SIZE
    }, function (err, doc) {
        if (!err) {
            res.render('data-user-content', {
                    users: doc
                }, function (err, output) {
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

router.get('/goods', function (req, res, next) {
    service.goods.count({}, function (err, count) {
        if (!err) {
            service.goods.find({}, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                if (!err) {
                    res.render('data-goods', {
                            count: Math.ceil(count / PAGE_SIZE),
                            goodss: doc
                        }, function (err, output) {
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
        } else {
            res.send({code: 400, msg: err.message})
        }

    });

})

router.get('/goods/content', function (req, res, next) {
    var index = req.query.index;
    service.goods.find({}, {
        sort: {date: -1},
        skip: (index - 1) * PAGE_SIZE,
        limit: PAGE_SIZE
    }, function (err, doc) {
        if (!err) {
            res.render('data-goods-content', {
                    goodss: doc
                }, function (err, output) {
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
