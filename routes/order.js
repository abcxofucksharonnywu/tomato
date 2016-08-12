var express = require('express')
var router = express.Router()
var service = require('../services/service')
var request = require('request');

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
                        request('http://e707ee91696535003b3778cbd5f00e5863f45d04:x@app917.salesbinder.com/api/items/' + item.goodsId + '.json', function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var json = JSON.parse(body)
                                var quantity = json.Item.quantity - item.quantity
                                request({
                                    method: 'PUT',
                                    url: 'http://e707ee91696535003b3778cbd5f00e5863f45d04:x@app917.salesbinder.com/api/items/' + item.goodsId + '.json',
                                    json: {
                                        "Item": {
                                            "quantity": quantity.toFixed(2) + ""
                                        }
                                    }
                                }, function (error, response, body) {
                                    if (!error && (response.statusCode == 200||response.statusCode == 302)) {
                                        console.log('quantity success')
                                    } else {
                                        console.log('quantity error')
                                    }
                                });
                            } else {
                                console.log('quantity error')
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
                    text: '訂單狀態:' + (order.state == 'receipt' ? '待接單 ' : order.state == 'delivery' ? '待收貨 ' : order.state == 'sign' ? '待簽收' : order.state == 'completion' ? '完成訂單' : order.state == 'canceled' ? '已取消' : ''),
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
