var express = require('express')
var router = express.Router()
var service = require('../services/service')

router.get('/', function (req, res, next) {
    var user = req.session.user
    if (user.permission && user.permission.contains('order')) {
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


router.post('/edit/state', function (req, res, next) {
    var order = req.body
    if (order) {
        service.order.findAndModify({_id: order._id}, {$set: {state: order.state}}, function (err, doc) {
            if (!err) {
                if (order.state == 'completion') {
                    order.items.forEach(function (item) {
                        service.goods.findAndModify({goodsId: item.goodsId}, {$set: {sale: item.quantity}}, function (err, doc) {
                            if (err) {
                                console.log(err.message)
                            }
                        })
                    })
                }
                service.io.emit('order-' + order.state, {
                    order: order,
                    type: order.state
                })
                service.sendMessage({
                    uid: order.uid,
                    title: '訂單通知',
                    text: '訂單號:' + order._id + '狀態已經修改為' + (order.state == 'receipt' ? '待接單 ' : order.state == 'delivery' ? '待收貨 ' : order.state == 'sign' ? '待簽收' : order.state == 'completion' ? '完成訂單' : order.state == 'canceled' ? '已取消' : ''),
                    type: 'order-detail',
                    content: order._id
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
