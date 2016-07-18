var express = require('express')
var router = express.Router()
var service = require('../../services/service')

router.get('/query', function (req, res, next) {
    var name = req.query.name
    if (name) {
        service.activity.findOne({name: name}, function (err, doc) {
            if (!err && doc) {
                res.send({code: 200, content: doc, extra: {search: '搜索樂事薯片青檸味70g'}})
            } else {
                res.send({code: 400, msg: "活動獲取失敗"})
            }
        })
    } else {
        res.send({code: 400, msg: "活動獲取失敗"})
    }
})


module.exports = router
