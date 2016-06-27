var express = require('express')
var router = express.Router()
var path = require('path')
var service = require('../services/service')
var request = require('request');

var PAGE_SIZE = 5

router.get('/', function (req, res, next) {
    res.render('data', {}, function (err, output) {
            if (!err) {
                res.json({
                    code: 200, content: output
                })
            } else {

                res.send({code: 400, msg: err.message})
            }
        }
    )
})


router.get('/order', function (req, res, next) {
    service.order.count({state: 'completion'}, function (err, count) {
        if (!err) {
            service.order.find({state: 'completion'}, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                if (!err) {
                    res.render('data-order', {
                            count: Math.ceil(count / PAGE_SIZE),
                            orders: doc
                        }, function (err, output) {
                            if (!err) {
                                res.json({
                                    code: 200, content: output
                                })
                            } else {
                                res.send({code: 400, msg: err.message})
                            }
                        }
                    )
                } else {
                    res.send({code: 400, msg: err.message})
                }
            })
        } else {
            res.send({code: 400, msg: err.message})
        }

    });

})

router.get('/order/content', function (req, res, next) {
    var index = req.query.index;
    service.order.find({state: 'completion'}, {
        sort: {date: -1},
        skip: (index - 1) * PAGE_SIZE,
        limit: PAGE_SIZE
    }, function (err, doc) {
        if (!err) {
            res.render('data-order-content', {
                    orders: doc
                }, function (err, output) {
                    if (!err) {
                        res.json({
                            code: 200, content: output
                        })
                    } else {
                        res.send({code: 400, msg: err.message})
                    }
                }
            )
        } else {
            res.send({code: 400, msg: err.message})
        }
    })
})


router.get('/user', function (req, res, next) {
    service.user.count({state: 'completion'}, function (err, count) {
        if (!err) {
            service.user.find({}, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                if (!err) {
                    res.render('data-user', {
                            count: Math.ceil(count / PAGE_SIZE),
                            users: doc
                        }, function (err, output) {
                            if (!err) {
                                res.json({
                                    code: 200, content: output
                                })
                            } else {
                                res.send({code: 400, msg: err.message})
                            }
                        }
                    )
                } else {
                    res.send({code: 400, msg: err.message})
                }
            })
        } else {
            res.send({code: 400, msg: err.message})
        }

    });

})

router.get('/user/content', function (req, res, next) {
    var index = req.query.index;
    service.user.find({}, {
        sort: {date: -1},
        skip: (index - 1) * PAGE_SIZE,
        limit: PAGE_SIZE
    }, function (err, doc) {
        if (!err) {
            res.render('data-user-content', {
                    users: doc
                }, function (err, output) {
                    if (!err) {
                        res.json({
                            code: 200, content: output
                        })
                    } else {
                        res.send({code: 400, msg: err.message})
                    }
                }
            )
        } else {
            res.send({code: 400, msg: err.message})
        }
    })
})

router.get('/goods', function (req, res, next) {
    service.goods.count({}, function (err, count) {
        if (!err) {
            service.goods.find({}, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                if (!err) {
                    res.render('data-goods', {
                            count: Math.ceil(count / PAGE_SIZE),
                            goodss: doc
                        }, function (err, output) {
                            if (!err) {
                                res.json({
                                    code: 200, content: output
                                })
                            } else {
                                res.send({code: 400, msg: err.message})
                            }
                        }
                    )
                } else {
                    res.send({code: 400, msg: err.message})
                }
            })
        } else {
            res.send({code: 400, msg: err.message})
        }

    });

})

router.get('/goods/content', function (req, res, next) {
    var index = req.query.index;
    service.goods.find({}, {
        sort: {date: -1},
        skip: (index - 1) * PAGE_SIZE,
        limit: PAGE_SIZE
    }, function (err, doc) {
        if (!err) {
            res.render('data-goods-content', {
                    goodss: doc
                }, function (err, output) {
                    if (!err) {
                        res.json({
                            code: 200, content: output
                        })
                    } else {
                        res.send({code: 400, msg: err.message})
                    }
                }
            )
        } else {
            res.send({code: 400, msg: err.message})
        }
    })
})

router.get('/goods/sync', function (req, res, next) {
    var categories = []
    getCategories(1, categories, res)
    var goodss = []
    getGoodss(1, goodss, res)
});

function getCategories(pageIndex, categories, res) {
    request('http://e707ee91696535003b3778cbd5f00e5863f45d04:x@app917.salesbinder.com/api/categories.json?page=' + pageIndex, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body)
            var mCategories = json.Categories
            for (var index in mCategories) {
                var obj = mCategories[index].Category
                categories.push({
                    categoryId: obj.id,
                    title: obj.name,
                    goodss: [],
                    date: new Date(obj.created).getTime()
                })
            }
            if (pageIndex < json.pages) {
                getCategories(++pageIndex, categories, res)
            } else {
                for (var c in categories) {
                    var category = categories[c];
                    (function (category) {
                        service.category.findOne({categoryId: category.categoryId}, function (err, doc) {
                            if (doc) {
                                service.category.findAndModify({categoryId: category.categoryId}, category, function (err, doc) {
                                    if (err) {
                                        console.log('category findAndModify error' + err.message)
                                    }
                                })
                            } else {
                                service.category.insert(category, function (err, doc) {
                                    if (err) {
                                        console.log('category insert error' + err.message)
                                    }
                                })
                            }
                        })
                    })(category)
                }
            }
        } else {
            res.send({code: 400, msg: "分類同步失敗"})
        }
    })
    // request('http://e707ee91696535003b3778cbd5f00e5863f45d04:x@app917.salesbinder.com/api/categories.json?page=' + pageIndex, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         var json = JSON.parse(body)
    //         var mCategories = json.Categories
    //         for (var index in mCategories) {
    //             var obj = mCategories[index].Category
    //             categories.push({
    //                 categoryId: obj.id,
    //                 title: obj.name,
    //                 goodss: [],
    //                 date: new Date(obj.created).getTime()
    //             })
    //         }
    //         if (pageIndex < json.pages) {
    //             getCategories(++pageIndex, categories, res)
    //         } else {
    //             service.category.remove({}, function (err, doc) {
    //                 if (!err) {
    //                     service.category.insert(categories, function (err, doc) {
    //                         if (err) {
    //                             console.log('category insert error' + err.message)
    //                         }
    //                     })
    //                 } else {
    //                     res.send({code: 400, msg: err.message})
    //                 }
    //
    //             })
    //
    //         }
    //     } else {
    //         res.send({code: 400, msg: "分類同步失敗"})
    //     }
    // })
}

function getGoodss(pageIndex, goodss, res) {
    request('http://e707ee91696535003b3778cbd5f00e5863f45d04:x@app917.salesbinder.com/api/items.json?page=' + pageIndex, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body)
            var mGoodss = json.Items
            for (var index in mGoodss) {
                var obj = mGoodss[index].Item
                var objImages = mGoodss[index].Image
                var images = []
                for (var j in objImages) {
                    var image = objImages[j]
                    images.push(image.url_medium)
                }
                goodss.push({
                    goodsId: obj.id,
                    categoryId: mGoodss[index].Category.id,
                    title: obj.name,
                    price: obj.price,
                    quantity: '1',
                    sale: '1',
                    images: images,
                    date: new Date(obj.created).getTime()
                })
            }
            if (pageIndex < json.pages) {
                getGoodss(++pageIndex, goodss, res)
            } else {
                for (var c in goodss) {
                    var goods = goodss[c];
                    (function (goods) {
                        service.goods.findOne({goodsId: goods.goodsId}, function (err, doc) {
                            if (doc) {
                                service.goods.findAndModify({goodsId: goods.goodsId}, goods, function (err, doc) {
                                    if (err) {
                                        console.log('goods findAndModify error' + err.message)
                                    }
                                })
                            } else {
                                service.goods.insert(goods, function (err, doc) {
                                    if (err) {
                                        console.log('goods insert error' + err.message)
                                    }
                                })
                            }
                        })
                    })(goods)
                }
                res.send({code: 200})
            }
        } else {
            res.send({code: 400, msg: "商品同步失敗"})
        }
    })

    // request('http://e707ee91696535003b3778cbd5f00e5863f45d04:x@app917.salesbinder.com/api/items.json?page=' + pageIndex, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         var json = JSON.parse(body)
    //         var mGoodss = json.Items
    //         for (var index in mGoodss) {
    //             var obj = mGoodss[index].Item
    //             var objImages = mGoodss[index].Image
    //             var images = []
    //             for (var j in objImages) {
    //                 var image = objImages[j]
    //                 images.push(image.url_medium)
    //             }
    //             goodss.push({
    //                 goodsId: obj.id,
    //                 categoryId: mGoodss[index].Category.id,
    //                 title: obj.name,
    //                 price: obj.price,
    //                 quantity: '1',
    //                 sale: '1',
    //                 images: images,
    //                 date: new Date(obj.created).getTime()
    //             })
    //         }
    //         if (pageIndex < json.pages) {
    //             getGoodss(++pageIndex, goodss, res)
    //         } else {
    //             service.goods.remove({}, function (err, doc) {
    //                 if (!err) {
    //                     service.goods.insert(goodss, function (err, doc) {
    //                         if (!err) {
    //                             res.send({code: 200})
    //                         } else {
    //                             res.send({code: 400, msg: err.message})
    //                         }
    //                     })
    //                 } else {
    //                     res.send({code: 400, msg: err.message})
    //                 }
    //
    //             })
    //         }
    //     } else {
    //         res.send({code: 400, msg: "商品同步失敗"})
    //     }
    // })
}

module.exports = router
