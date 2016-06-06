var express = require('express')
var router = express.Router()
var path = require('path')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        name: req.session.user.name
    })
})

module.exports = router
