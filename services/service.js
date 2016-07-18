var request = require('request');
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
service.goods.index('goodsId', {unique: true}) // unique

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
    token: '',
    phone: '',
    password: '',
    type: '',//unreachable
    date: ''
}
service.user = service.db.get('user')
service.user.index('device', {unique: true}) // unique


var model = {
    title: '主页',
    name: 'home',
    content: '番茄app的主页',
    type: 'layout',
    url: 'http://localhost:3000/m/activity-preview.html',
    date: '1460982447980',
    layouts: []
}
service.activity = service.db.get('activity')
service.activity.index('title', {unique: true}) // unique
service.activity.index('name', {unique: true}) // unique

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

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

service.sendMessage = function (obj, callback) {
    service.user.findOne({_id: obj.uid}, function (err, doc) {
        if (!err && doc) {
            request({
                url: 'https://fcm.googleapis.com/fcm/send',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AIzaSyAS8xSCp-xKaIV8jIjN6M7a8Nb6fI2HHro'
                },
                postData: {
                    "to": doc.token,
                    "notification": {
                        "title": obj.title,
                        "text": obj.text
                    },
                    "data": {
                        "type": obj.type,
                        "content": obj.content
                    }
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('sendMessage success')
                } else {
                    console.log('sendMessage error' + error.message)
                }
                if (callback) {
                    callback(error, response, body)
                }

            });
        } else {
            console.log('sendMessage error')
            if (callback) {
                callback(null, null, null)
            }

        }
    });

}

module.exports = service
