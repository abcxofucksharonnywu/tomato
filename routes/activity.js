var express = require('express')
var router = express.Router()
var service = require('../services/service')
var utils = require('../utils/utils')

router.get('/', function (req, res, next) {
    service.activity.find({}, {sort: {date: 1}}, function (err, doc) {
        if (!err) {
            res.render('activity', {
                    activities: doc
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

router.post('/delete', function (req, res, next) {
    var name = req.body.name
    if (name) {
        service.activity.remove({
            name: name
        }, function (err, doc) {
            if (!err) {
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "刪除活動失敗"})
    }
})


router.post('/add', function (req, res, next) {
    var activity = req.body
    if (activity) {
        if (activity.type == 'layout') {
            activity.url = 'activity.html?name=' + activity.name
        }
        activity.date = Date.now()
        service.activity.insert(activity, function (err, doc) {
            if (!err) {
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "添加活動失敗"})
    }
})

router.post('/edit', function (req, res, next) {
    var activity = req.body
    if (activity) {
        if (activity.type == 'layout') {
            activity.url = 'activity.html?name=' + activity.name
        }
        service.activity.findAndModify({name: activity.name}, activity, function (err, doc) {
            if (!err) {
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "保存活動失敗"})
    }
})


router.get('/query', function (req, res, next) {
    var name = req.query.name
    if (name) {
        service.activity.findOne({name: name}, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: "活動獲取失敗"})
            }
        })
    } else {
        res.send({code: 400, msg: "活動獲取失敗"})
    }
})


module.exports = router
