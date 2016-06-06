String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str)
    return reg.test(this)
}

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$")
    return reg.test(this)
}

var utils = {}

var fs = require('fs')

utils.write = function (dst, data, callback) {
    fs.writeFile(dst, data, callback)
}

utils.copy = function (src, dst, callback) {
    fs.readFile(src, function (error, data) {
        fs.writeFile(dst, data, callback)
    })
}

utils.exists = function (path, callback) {
    fs.exists(path, callback)
}

utils.delete = function (path, callback) {
    fs.unlink(path, callback)
}

utils.string = function () {
    var len = 10
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

utils.fs=fs

module.exports = utils

