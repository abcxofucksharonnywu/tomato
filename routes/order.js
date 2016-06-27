var express = require('express')
var router = express.Router()
var service = require('../services/service')

router.get('/', function (req, res, next) {
    res.render('order', {}, function (err, output) {
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
    var type = req.query.type ? req.query.type : 'receipt'
    service.order.find({state: type,}, {sort: {date: -1}}, function (err, doc) {
        if (!err) {
            res.render('order-list', {
                    type: req.query.type,
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


router.get('/io', function (req, res, next) {
    service.io.emit('order-' + req.query.type, {
        orders: ['wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe', 'wefwefwe']
    })
    res.send({code: 200})

})

router.post('/edit/state', function (req, res, next) {
    var order = req.body
    if (order) {
        service.order.findAndModify({_id: order._id}, {$set: {state: order.state}}, function (err, doc) {
            if (!err) {
                if (order.state == 'completion') {
                    for (var i in order.items) {
                        var item = order.items[i]
                        service.goods.findAndModify({goodsId: item.goodsId}, {$set: {sale: item.quantity}}, function (err, doc) {
                            if (err) {
                                console.log(err.message)
                            }
                        })
                    }
                }
                service.io.emit('order-' + order.state, {
                    orders: [order]
                })
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "修改订单状态失败"})
    }
})

router.post('/delete', function (req, res, next) {

})


module.exports = router
