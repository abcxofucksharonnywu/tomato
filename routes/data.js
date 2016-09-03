var express = require('express')
var router = express.Router()
var path = require('path')
var service = require('../services/service')
var request = require('request');

var PAGE_SIZE = 5

var mongodb = require("mongodb"),
    objectid = mongodb.BSONPure.ObjectID;

router.get('/', function (req, res, next) {
    var user = req.session.user
    if (user.permission && user.permission.contains('data')) {
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
    } else {
        res.render('permission', {}, function (err, output) {
                if (!err) {
                    res.json({
                        code: 200, content: output
                    })
                } else {
                    res.send({code: 400, msg: err.message})
                }
            }
        )
    }

})


router.get('/order', function (req, res, next) {
    service.order.count({}, function (err, count) {
        if (!err) {
            service.order.find({}, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
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


router.get('/order/list', function (req, res, next) {
    var text = req.query.search
    if (text && !objectid.isValid(text)) {
        res.render('data-order-list', {
                count: 0,
                orders: null
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
        var query = text ? {_id: text} : {}
        service.order.count(query, function (err, count) {
            if (!err) {
                service.order.find(query, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                    if (!err) {
                        res.render('data-order-list', {
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
    }


})

router.get('/order/content', function (req, res, next) {
    var index = req.query.index
    var text = req.query.search
    var query = text ? {_id: text} : {}
    service.order.find(query, {
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
    service.user.count({}, function (err, count) {
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


router.get('/user/list', function (req, res, next) {
    var text = req.query.search
    var query = text ? {name: {'$regex': '.*' + text + '.*'}} : {}
    service.user.count(query, function (err, count) {
        if (!err) {
            service.user.find(query, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                if (!err) {
                    res.render('data-user-list', {
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
    var text = req.query.search
    var query = text ? {name: {'$regex': '.*' + text + '.*'}} : {}
    service.user.find(query, {
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
            service.goods.find({}, {sort: {sale: 1}, limit: PAGE_SIZE}, function (err, doc) {
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


router.get('/goods/list', function (req, res, next) {
    var text = req.query.search
    var query = text ? {title: {'$regex': '.*' + text + '.*'}} : {}
    service.goods.count(query, function (err, count) {
        if (!err) {
            service.goods.find(query, {sort: {date: -1}, limit: PAGE_SIZE}, function (err, doc) {
                if (!err) {
                    res.render('data-goods-list', {
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
    var text = req.query.search
    var query = text ? {title: {'$regex': '.*' + text + '.*'}} : {}
    service.goods.find(query, {
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


router.get('/search', function (req, res, next) {
    service.search.col.aggregate({
        $group: {
            _id: '$title',
            date: {$max: '$date'},
            count: {$sum: 1}
        }
    }, {$sort: {count: -1}}, function (err, doc) {
        if (!err) {
            var searchs = []
            doc.forEach(function (item) {
                searchs.push({title: item._id, date: item.date, count: item.count})
            })
            res.render('data-search', {
                    count: Math.ceil(searchs.length / PAGE_SIZE),
                    searchs: searchs.slice(0, PAGE_SIZE)
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


router.get('/search/list', function (req, res, next) {
    var text = req.query.search
    var query = text ? {title: {'$regex': '.*' + text + '.*'}} : {}
    service.search.col.aggregate({$match: query}, {
        $group: {
            _id: '$title',
            date: {$max:'$date'},
            count: {$sum: 1}
        }
    }, {$sort: {count: -1}}, function (err, doc) {
        if (!err) {
            var searchs = []
            doc.forEach(function (item) {
                searchs.push({title: item._id, date: item.date, count: item.count})
            })
            res.render('data-search-list', {
                    count: Math.ceil(searchs.length / PAGE_SIZE),
                    searchs: searchs.slice(0, PAGE_SIZE)
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

router.get('/search/content', function (req, res, next) {
    var index = req.query.index;
    var text = req.query.search
    var query = text ? {title: {'$regex': '.*' + text + '.*'}} : {}
    service.search.col.aggregate({$match: query}, {
        $group: {
            _id: '$title',
            date: {$max:'$date'},
            count: {$sum: 1}
        }
    }, {$sort: {count: -1}}, {$skip: (index - 1) * PAGE_SIZE}, {$limit: PAGE_SIZE}, function (err, doc) {
        if (!err) {
            var searchs = []
            doc.forEach(function (item) {
                searchs.push({title: item._id, date: item.date, count: item.count})
            })
            res.render('data-search-content', {
                    searchs: searchs
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
            mCategories.forEach(function (o) {
                var obj = o.Category
                categories.push({
                    categoryId: obj.id,
                    title: obj.name,
                    goodss: [],
                    date: new Date(obj.created).getTime()
                })
            })
            if (pageIndex < json.pages) {
                getCategories(++pageIndex, categories, res)
            } else {
                var ids = []
                categories.forEach(function (category) {
                    ids.push(category.categoryId);
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
                })
                service.category.remove({'categoryId': {$nin: ids}}, function (err, doc) {
                    if (err) {
                        console.log('category delete error' + err.message)
                    } else {
                        console.log('category delete success')
                    }
                })
            }
        } else {
            res.send({code: 400, msg: "分類同步失敗"})
        }
    })
}

function getGoodss(pageIndex, goodss, res) {
    request('http://e707ee91696535003b3778cbd5f00e5863f45d04:x@app917.salesbinder.com/api/items.json?page=' + pageIndex, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body)
            var mGoodss = json.Items
            mGoodss.forEach(function (o) {
                var obj = o.Item
                var objImages = o.Image
                var images = []
                objImages.forEach(function (image) {
                    images.push(image.url_original)
                })
                goodss.push({
                    goodsId: obj.id,
                    categoryId: o.Category.id,
                    categoryName: o.Category.name,
                    title: obj.name,
                    price: parseFloat(obj.price).toFixed(2) + '',
                    quantity: '1',
                    sale: '1',
                    shop: o.ItemDetail[0] ? o.ItemDetail[0].value : '',
                    images: images,
                    date: new Date(obj.created).getTime()
                })
            })

            if (pageIndex < json.pages) {
                getGoodss(++pageIndex, goodss, res)
            } else {
                var ids = []
                goodss.forEach(function (goods) {
                    ids.push(goods.goodsId);
                    (function (goods) {
                        service.goods.findOne({goodsId: goods.goodsId}, function (err, doc) {
                            if (doc) {
                                doc.categoryId = goods.categoryId
                                doc.categoryName = goods.categoryName
                                doc.title = goods.title
                                doc.price = goods.price
                                doc.quantity = goods.quantity
                                doc.shop = goods.shop
                                doc.images = goods.images
                                doc.date = goods.date
                                service.goods.findAndModify({goodsId: goods.goodsId}, doc, function (err, doc) {
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
                })
                service.goods.remove({'goodsId': {$nin: ids}}, function (err, doc) {
                    if (err) {
                        console.log('goods delete error' + err.message)
                    } else {
                        console.log('goods delete success')
                    }
                })

                res.send({code: 200})
            }
        } else {
            res.send({code: 400, msg: "商品同步失敗"})
        }
    })


}

module.exports = router
