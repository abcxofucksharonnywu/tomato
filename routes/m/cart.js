var express = require('express');
var router = express.Router();
var path = require('path');
var service = require('../../services/service')

router.get('/queryList', function (req, res, next) {
    var uid = req.query.uid
    if (uid) {
        service.cart.find({uid: uid}, {sort: {date: -1}}, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: '購物車獲取失敗'})
    }
});


router.post('/add', function (req, res, next) {
    var cart = req.body
    if (cart && cart.uid) {
        cart.date = Date.now()
        service.cart.findOne({goodsId: cart.goodsId}, function (err, doc) {
            if (doc) {
                cart.quantity = parseInt(cart.quantity) + parseInt(doc.quantity)
                service.cart.findAndModify({goodsId: cart.goodsId}, cart, function (err, doc) {
                    if (!err) {
                        res.send({code: 200, content: cart})
                    } else {
                        res.send({code: 400, msg: err.message})
                    }
                })
            } else {
                service.cart.insert(cart, function (err, doc) {
                    if (!err) {
                        res.send({code: 200, content: doc})
                    } else {
                        res.send({code: 400, msg: err.message})
                    }
                })
            }
        })
    } else {
        res.send({code: 400, msg: "添加購物車失敗"})
    }
});

router.post('/edit', function (req, res, next) {
    var cart = req.body
    if (cart) {
        service.cart.findAndModify({_id: cart._id}, cart, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: cart})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "保存購物車失敗"})
    }

});

router.get('/delete', function (req, res, next) {
    var cartId = req.query.cartId
    if (cartId) {
        service.cart.remove({
            _id: cartId
        }, function (err, doc) {
            if (!err) {
                res.send({code: 200})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "刪除購物車失敗"})
    }
});

module.exports = router;
