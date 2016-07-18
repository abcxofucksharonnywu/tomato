var express = require('express');
var router = express.Router();
var service = require('../../services/service')

router.get('/queryList', function (req, res, next) {
    var uid = req.query.uid
    if (uid) {
        service.search.find({uid: uid}, {sort: {date: -1}, limit: 10}, function (err, doc) {
            if (!err) {
                var searchs = {
                    recentSearchs: doc,
                    hotSearchs: []
                }

                service.search.col.aggregate({
                    $group: {
                        _id: '$title',
                        count: {$sum: 1}
                    }
                }, {$sort: {count: -1}}, {$limit: 10}, function (err, doc) {
                    if (!err) {
                        doc.forEach(function (item) {
                            searchs.hotSearchs.push({title: item._id})
                        })
                        res.send({code: 200, content: searchs})
                    } else {
                        res.send({code: 400, msg: err.message})
                    }

                })

            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: '獲取搜索關鍵字失敗'})
    }

});

router.get('/clear', function (req, res, next) {
    var uid = req.query.uid
    if (uid) {
        service.search.remove({uid: uid}, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: '刪除搜索關鍵字失敗'})
    }

});

router.get('/query', function (req, res, next) {
    var text = req.query.text
    var uid = req.query.uid
    if (uid && text) {
        var search = {
            title: text,
            uid: uid,
            date: Date.now()
        }
        service.search.findOne({uid: search.uid, title: search.title}, function (err, doc) {
            if (doc) {
                service.search.findAndModify({uid: search.uid, title: search.title}, search, function (err, doc) {
                    if (!err) {
                        getGoods()
                    } else {
                        res.send({code: 400, msg: err.message})
                    }
                })
            } else {
                service.search.insert(search, function (err, doc) {
                    if (!err) {
                        getGoods()
                    } else {
                        res.send({code: 400, msg: err.message})
                    }
                })
            }
        })

        function getGoods() {
            service.goods.find({title: {'$regex': '.*' + text + '.*'}}, {sort: {date: -1}}, function (err, doc) {
                if (!err) {
                    res.send({code: 200, content: doc})
                } else {
                    res.send({code: 400, msg: err.message})
                }
            })
        }


    } else {
        res.send({code: 400, msg: '獲取搜索關鍵字失敗'})
    }

});

module.exports = router;
