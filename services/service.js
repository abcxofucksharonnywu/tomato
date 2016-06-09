var service = {}
service.db = require('monk')('localhost/tomato')
var model = {
    userId: '',
    name: '',
    post: '',
    phone: '',
    content: '',
    date: ''
}
service.address = service.db.get('address')


var model = {
    userId: '',
    goodsId: '',
    quantity: '',
    price: '',
    date: ''

}
service.cart = service.db.get('cart')

var model = {
    parentId: '',
    title: '',
    date: ''
}
service.category = service.db.get('category')
service.category.index('title', {unique: true}) // unique

var model = {
    categoryId: '',
    title: '',
    content: '',
    images: [],
    quantity: '',
    price: '',
    date: ''
}
service.goods = service.db.get('goods')
service.goods.index('title', {unique: true}) // unique

var model = {
    userId: '',
    address: {
        name: '',
        post: '',
        phone: '',
        content: '',
    },
    title: '',
    items: [
        {
            goodsId: '', title: '', content: '', quantity: '', price: '', images: []
        }],
    price: '',
    state: '',//receipt,delivery,sign,completion,canceled
    date: ''
}
service.order = service.db.get('order')

var model = {
    title: '',
    date: ''
}
service.search = service.db.get('search')

var model = {
    name: '',
    device: '',
    token:'',
    phone: '',
    password: '',
    type: '',//unreachable
    date: ''
}
service.user = service.db.get('user')
service.user.index('name', {unique: true}) // unique
service.user.index('device', {unique: true}) // unique


var model = {
    title: '主页',
    name: 'home',
    content: '番茄app的主页',
    type: 'layout',
    url: 'http://localhost:3000/m/home.html',
    date: '1460982447980',
    layouts: [{
        type: 'multiRect',
        items: [{img: '', type: 'goods', url: '', size: '375x528'}, {
            img: '',
            type: 'activity',
            url: '',
            size: '375x528'
        }]
    }]
}
service.activity = service.db.get('activity')
service.activity.index('title', {unique: true}) // unique
service.activity.index('name', {unique: true}) // unique
service.activity.index('url', {unique: true}) // unique

var model = {
    name: '',
    realName: '',
    phone: '',
    password: '',
    permission: [],//order ,activity ,data ,user
    type: '',//master,staff,
    date: ''
}

service.user_manager = service.db.get('user_manager')
service.user_manager.index('name', {unique: true}) // unique


//长连接
var express = require('express')
var app = express()
var server = require('http').Server(app)
server.listen(3001)
service.io = require('socket.io')(server)
service.io.on('connection', function (socket) {
    console.log('socket connected')
    socket.on('disconnect', function () {
        console.log('socket disconnected')
    })
})

module.exports = service
