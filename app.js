var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')


var app = express()

//视图解析模板
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

//设置基本设置
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'm')))
MongoStore = require('connect-mongo')(session)
app.use(session({
    secret: 'tomato',
    saveUninitialized: true,
    // cookie: {
    //     maxAge: 365 * 3600000
    // },
    resave: true,
    store: new MongoStore({url: 'mongodb://localhost:27017/tomato'})
}))


//请求拦截器
app.use('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var url = req.originalUrl
    if (!url.startWith("/m")) {
        var isLogin = req.session != null && req.session.user != null
        var isFromLogin = url == "/user/login"
        if (isLogin && isFromLogin) {
            return res.redirect("/")
        } else if (!isLogin && !isFromLogin) {
            if (!isFromLogin) {
                return res.redirect("/user/login")
            }
        }
    }
    next()

})

app.use('/test', function (req, res, next) {
    res.render('test', {
    })
})


//网页
app.use('/', require('./routes/index'))
app.use('/order', require('./routes/order'))
app.use('/activity', require('./routes/activity'))
app.use('/data', require('./routes/data'))
app.use('/user', require('./routes/user'))


//客户端
app.use('/m/activity', require('./routes/m/activity'))
app.use('/m/address', require('./routes/m/address'))
app.use('/m/cart', require('./routes/m/cart'))
app.use('/m/category', require('./routes/m/category'))
app.use('/m/goods', require('./routes/m/goods'))
app.use('/m/order', require('./routes/m/order'))
app.use('/m/user', require('./routes/m/user'))




// 404处理
app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})


//开发环境下设置打印
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })

}



app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})


module.exports = app

