var express = require('express');
var router = express.Router();
var service = require('../../services/service')

router.get('/queryList', function (req, res, next) {
    var uid = req.query.uid
    if (uid) {
        service.order.find({uid: uid}, {sort: {date: -1}, limit: 5}, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: '獲取訂單失敗'})
    }
});

router.get('/query', function (req, res, next) {
    var orderId = req.query.orderId
    if (orderId) {
        service.order.findOne({_id: orderId}, function (err, doc) {
            if (!err) {
                res.send({
                    code: 200,
                    content: doc,
                    extra: {pay: {text: '貨到付款', hint: '（支持現金或者POS機）'}, delivery: {text: '配送時間', hint: '（接受訂單後40分鐘內到達）'}}
                })
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "訂單獲取失敗"})
    }
})

router.post('/build', function (req, res, next) {
    var uid = req.body.uid
    var cartIds = []
    req.body.cartIds.forEach(function (id) {
        cartIds.push(service.cart.id(id))
    })

    var order = {
        uid: uid,
        items: [],
        quantity: '0',
        price: '0'
    }
    service.address.find({uid: uid}, {sort: {date: -1}}, function (err, doc) {
        if (!err) {
            order.address = doc[0]
            service.cart.find({_id: {$in: cartIds}}, {sort: {date: -1}}, function (err, doc) {
                if (!err) {
                    doc.forEach(function (cart) {
                        order.items.push(cart)
                        order.quantity = parseInt(order.quantity) + parseInt(cart.quantity)
                        order.price = (parseFloat(order.price) + cart.price * cart.quantity).toFixed(2)
                    })
                    res.send({code: 200, content: order})
                } else {
                    res.send({code: 400, msg: err.message})
                }
            })

        } else {
            res.send({code: 400, msg: err.message})
        }
    })
});

router.post('/create', function (req, res, next) {
    var order = JSON.parse(req.body.order)
    if (order) {
        if (order.price >= 10) {
            order.state = 'receipt'
            order.date = Date.now()
            service.order.insert(order, function (err, doc) {
                if (!err) {
                    var goodsIds = []
                    order.items.forEach(function (item) {
                        goodsIds.push(item.goodsId)
                    })
                    service.cart.remove({
                        goodsId: {$in: goodsIds}
                    }, function (err, doc) {
                        if (err) {
                            console.log('創建訂單刪除購物車商品失敗:' + err.message)
                        }
                        service.io.emit('order-' + order.state, {
                            order: order,
                            type: order.state
                        })
                        res.send({code: 200, content: doc})
                    })
                } else {
                    res.send({code: 400, msg: err.message})
                }
            })
        } else {
            res.send({code: 400, msg: "訂單總價低於10元不支持配送"})
        }

    } else {
        res.send({code: 400, msg: '創建訂單失敗'})
    }

});

router.get('/cancel', function (req, res, next) {
    var orderId = req.query.orderId
    if (orderId) {
        service.order.findOne({_id: orderId}, function (err, doc) {
            if (!err) {
                if (doc.state == 'receipt' || doc.state == 'delivery') {
                    service.order.findAndModify({_id: orderId}, {$set: {state: 'canceled'}}, function (err, doc) {
                        if (!err) {
                            var order = doc
                            var state = order.state
                            order.state = 'canceled'
                            service.io.emit('order-' + state, {
                                order: order,
                                type: order.state
                            })
                            service.io.emit('order-canceled', {
                                order: order,
                                type: order.state
                            })
                            res.send({code: 200, content: doc})
                        } else {
                            res.send({code: 400, msg: err.message})
                        }
                    })
                } else {
                    var msg = '訂單無法取消'
                    if (doc.state == 'sign') {
                        msg = '訂單已經配送中,無法取消'
                    } else if (doc.state == 'completion') {
                        msg = '訂單已經完成,無法取消'
                    } else if (doc.state == 'canceled') {
                        msg = '訂單已經取消了'
                    }
                    res.send({code: 400, msg: msg})
                }
            } else {
                res.send({code: 400, msg: err.message})
            }
        })

    } else {
        res.send({code: 400, msg: '取消訂單失敗'})
    }

});

module.exports = router;
