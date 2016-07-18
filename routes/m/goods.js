var express = require('express');
var router = express.Router();
var service = require('../../services/service')

router.get('/queryList', function (req, res, next) {
    var categoryId = req.query.categoryId
    var shop = req.query.shop
    if (categoryId || shop) {
        var query = categoryId ? {categoryId: categoryId} : {shop: shop}
        service.goods.find(query, {sort: {date: 1}}, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: '商品獲取失敗'})
    }

});

router.get('/query', function (req, res, next) {
    var goodsId = req.query.goodsId
    if (goodsId) {
        service.goods.findOne({goodsId: goodsId}, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "商品獲取失敗"})
    }
})


module.exports = router;
