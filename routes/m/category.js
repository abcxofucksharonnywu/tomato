var express = require('express');
var router = express.Router();
var path = require('path');
var service = require('../../services/service')

router.get('/queryList', function (req, res, next) {
    service.category.find({}, {sort: {date: 1}}, function (err, doc) {
        if (!err) {
            res.send({code: 200, content: doc, extra: {search: '搜索樂事薯片青檸味70g'}})
        } else {
            res.send({code: 400, msg: err.message})
        }
    })
});

router.get('/queryGoodss', function (req, res, next) {
    var categoryId = req.query.categoryId
    if (categoryId) {
        service.goods.find({categoryId: categoryId}, {sort: {date: 1}}, function (err, doc) {
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

module.exports = router;
