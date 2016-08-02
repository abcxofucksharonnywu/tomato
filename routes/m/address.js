var express = require('express');
var router = express.Router();
var service = require('../../services/service')


router.get('/queryList', function (req, res, next) {
    var uid = req.query.uid;
    if (uid) {
        service.address.find({uid: uid}, {sort: {date: -1}}, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: '獲取地址失敗'})
    }

});

router.get('/delete', function (req, res, next) {
    var addressId = req.query.addressId
    if (addressId) {
        service.address.remove({
            _id: addressId
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
    var address = req.body
    if (address && address.uid) {
        address.date = Date.now()
        if (address.post.indexOf('11354') != -1 || address.post.indexOf('11355') != -1) {
            service.address.insert(address, function (err, doc) {
                if (!err) {
                    res.send({code: 200, content: doc})
                } else {
                    res.send({code: 400, msg: err.message})
                }
            })
        } else {
            res.send({code: 400, msg: "添加地址失敗,暫時只支持配送郵區11354和11355"})
        }
    } else {
        res.send({code: 400, msg: "添加地址失敗"})
    }
})

router.post('/edit', function (req, res, next) {
    var address = req.body
    if (address) {
        address.date = Date.now()
        if (address.post.indexOf('11354') != -1 || address.post.indexOf('11355') != -1) {
            service.address.findAndModify({_id: address._id}, address, function (err, doc) {
                if (!err) {
                    res.send({code: 200, content: address})
                } else {
                    res.send({code: 400, msg: err.message})
                }
            })
        } else {
            res.send({code: 400, msg: "添加地址失敗,暫時只支持配送郵區11354和11355"})
        }
    } else {
        res.send({code: 400, msg: "保存地址失敗"})
    }
})

module.exports = router;
