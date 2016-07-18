var express = require('express');
var router = express.Router();
var service = require('../../services/service')

router.get('/queryList', function (req, res, next) {
    var uid = req.query.uid
    if (uid) {
        service.order.find({uid: uid}, {sort: {date: -1}}, function (err, doc) {
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
                res.send({code: 200, content: doc})
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
                        order.price = parseFloat(order.price) + cart.price * cart.quantity
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
        order.state = 'receipt'
        order.date = Date.now()
        service.order.insert(order, function (err, doc) {
            if (!err) {
                service.io.emit('order-' + order.state, {
                    order: order,
                    type: order.state
                })
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: '創建訂單失敗'})
    }

});

router.get('/cancel', function (req, res, next) {
    var orderId = req.query.orderId
    if (orderId) {
        service.order.findAndModify({_id: orderId}, {$set: {state: 'canceled'}}, function (err, doc) {
            if (!err) {
                var order = doc
                order.state = 'canceled'
                service.io.emit('order-receipt', {
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
        res.send({code: 400, msg: '取消訂單失敗'})
    }

});

module.exports = router;
