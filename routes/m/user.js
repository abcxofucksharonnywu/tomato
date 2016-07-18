var express = require('express');
var router = express.Router();
var service = require('../../services/service');

router.get('/list', function (req, res, next) {

});
router.get('/query', function (req, res, next) {

});
router.post('/login', function (req, res, next) {

});


router.get('/token', function (req, res, next) {
    var uid = req.query.uid;
    var token = req.query.token;
    if (uid && token) {
        service.user.findAndModify({_id: uid}, {$set: {token: token}}, function (err, doc) {
            if (!err) {
                doc.token = token
                res.send({code: 200, content: doc})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else{
        res.send({code: 400, msg: "添加推送失敗"});
    }
});

router.post('/register', function (req, res, next) {
    var user = req.body;
    if (user && user.device) {
        service.user.findOne({device: user.device}, function (err, doc) {
            if (!err) {
                if (doc) {
                    res.send({code: 200, content: doc})
                } else {
                    user.date = Date.now()
                    service.user.insert(user, function (err, doc) {
                        if (!err) {
                            res.send({code: 200, content: doc})
                        } else {
                            res.send({code: 400, msg: err.message});
                        }
                    });
                }
            } else {
                res.send({code: 400, msg: err.message});
            }
        });
    } else {
        res.send({code: 400, msg: "添加帳號失敗"});
    }

});

router.post('/edit', function (req, res, next) {
    var user = req.body
    if (user) {
        service.user.findAndModify({device: user.device}, user, function (err, doc) {
            if (!err) {
                res.send({code: 200, content: user})
            } else {
                res.send({code: 400, msg: err.message})
            }
        })
    } else {
        res.send({code: 400, msg: "保存用戶失敗"})
    }
});

module.exports = router;
