var myApp = new Framework7({
    modalTitle: 'Framework7',
    animateNavBackIcon: true,
});
// Expose Internal DOM library
var $$ = Dom7;

function toast(message) {
    var toast = myApp.toast(message, '', {});
    toast.show()
}

// Add main view
var mainView = myApp.addView('.view-main', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true,
    domCache: true
});


var view1 = myApp.addView('#view-1', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true,
    domCache: true
});

var view2 = myApp.addView('#view-2', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true,
    domCache: true
});


var view3 = myApp.addView('#view-3', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true,
    domCache: true
});


var view4 = myApp.addView('#view-4', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true,
    domCache: true
});


var host = 'http://www.dajitogo.com:3000'
// var host = 'http://localhost:3000'


var view2Init = false
var view3Init = false
var view4Init = false

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

Vue.filter('date', function (value) {
    return new Date(parseInt(value)).format('yyyy年MM月dd日 hh時mm分ss秒')
})

Vue.filter('time', function (value) {
    return new Date(parseInt(value)).format('MM月dd日 hh:mm')
})


var gVue = new Vue({
    el: '.toolbar.tabbar.tabbar-labels',
    data: {
        badge3: 0
    },
    methods: {}
});


var isApp = typeof cordova !== 'undefined'


function setItem(key, value) {
    if (isApp) {
        NativeStorage.setItem(key, value, function (doc) {
        }, function (error) {
        });
    } else {
        localStorage.setItem(key, value)
    }

}

function getItem(key, callback) {
    if (isApp) {
        NativeStorage.getItem(key, function (doc) {
            callback(doc)
        }, function (error) {
            callback(null)
        });
    } else {
        callback(localStorage.getItem(key))
    }

}

var user = {device: '', name: '', phone: ''}

function storeUser(obj) {
    user._id = obj._id
    user.name = obj.name
    user.device = obj.device
    user.token = obj.token
    user.phone = obj.phone
    user.password = obj.password
    user.date = obj.date
    setItem("user", JSON.stringify(user))
}

var onHomePageInit = myApp.onPageInit('home', function (page) {
    console.log('home init')
    toActivity(generatePageId('home'), 'home')
    $(".view[data-page='home']  .right.scan").click(function (event) {
        event.preventDefault()
        toScan()
    })
})

function userInit() {
    getItem('user', function (doc) {
        if (doc) {
            obj = JSON.parse(doc)
            user._id = obj._id
            user.name = obj.name
            user.device = obj.device
            user.token = obj.token
            user.phone = obj.phone
            user.password = obj.password
            user.date = obj.date
        } else {
            if (isApp) {
                user.device = device.uuid
                user.name = device.name
            } else {
                user.device = '111111'
                user.name = 'tomato'
            }
            $.post(host + '/m/user/register', user, function (result) {
                if (result.code == 200) {
                    storeUser(result.content)
                    console.log("user register");
                } else {
                    toast(result.msg);
                    ;
                }
            })
        }
    })
    onHomePageInit.trigger()
}


function userTokenInit(token) {
    console.log("user token init");
    if (user._id && token != user.token) {
        $.get(host + '/m/user/token', {uid: user._id, token: token}, function (result) {
            if (result.code == 200) {
                storeUser(result.content)
                console.log("user token");
            } else {
                toast(result.msg);
            }
        })
    }
}

function notification(doc, show) {
    function go(doc) {
        if (doc.type == 'goods') {
            toDetail({
                goodsId: doc.content
            }, true)
        } else if (doc.type == 'order') {
            myApp.getCurrentView().router.load({
                url: 'order.html'
            })
        } else if (doc.type == 'order-detail') {
            toOrderDetail({_id: doc.content}, null, true)
        } else if (doc.type == 'url') {
            myApp.getCurrentView().router.load({
                url: 'web.html',
                query: {url: doc.content, name: '網頁'}
            })
        }
    }

    if (show) {
        myApp.addNotification({
            title: doc.title,
            message: doc.text,
            media: '<i class="icon icon-logo"></i>',
            onClick: function (event) {
                myApp.closeNotification(event.currentTarget)
                go(doc)
            }
        });
    } else {
        go(doc)
    }

}


if (isApp) {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", function (event) {
            myApp.hideIndicator()
            var modal = myApp.closeModal()
            if (!modal) {
                if (myApp.getCurrentView().history.length > 1) {
                    myApp.getCurrentView().router.back()
                } else {
                    navigator.app.exitApp()
                }
            }
        }, false);
        userInit()
    }
} else {
    userInit()
}


$(".tab-link").click(function (event) {
    event.preventDefault()
    var href = $(event.currentTarget).attr('href')
    if (href == '#view-2') {
        if (!view2Init) {
            view2Init = true
            onCategoryPageInit.trigger()
        }
    } else if (href == '#view-3') {
        if (!view3Init) {
            view3Init = true
            onCartPageInit.trigger()
        } else {
            onCartPageReInit.trigger()
        }
    } else if (href == '#view-4') {
        if (!view4Init) {
            view4Init = true
            onMePageInit.trigger()
        }
    }
})


function generatePageId(pageName) {
    var character = "";
    for (var i = 0; i < 32; i++) {
        character += String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0));
    }
    var pageClass = character
    var pageId = '.' + pageName + '.' + pageClass
    $('.page:not(.' + pageName + ')[data-page=' + pageName + ']').addClass(pageClass).addClass(pageName)
    return '.page[data-page=' + pageName + ']' + pageId
}

$.ajaxSetup({
    beforeSend: function (jqXHR, settings) {
        jqXHR.url = settings.url;
    },
    error: function (xhr, status, error) {
        console.log(xhr.statusText)
        myApp.hideIndicator()
        myApp.pullToRefreshDone($$('.pull-to-refresh-content'));
        toast(xhr.statusText == 'error' ? '網絡請求失敗' : xhr.statusText)
        if (xhr.url.indexOf('/m/category/queryList') != -1) {
            view2Init = false
        }
    }
});

function toActivity(el, name) {
    var vue = new Vue({
        el: el,
        data: {
            activity: null
        },
        watch: {
            'activity': function (val, oldVal) {
                var width = isApp ? device.width : $(el + " .page-content").width()
                var ratio = width / 375.0
                $(el + " .page-content .banner").height(140 * ratio)
                $(el + " .page-content .multiRect >div").height(165 * ratio)
                $(el + " .page-content .rect >div").height(140 * ratio)
                $(el + " .page-content .double img").height((width - 1) / 2)
                myApp.initPageSwiper($$(el))
            },
        },
        methods: {
            onItemClick: function (event, item) {
                event.preventDefault()
                if (item.type == 'goods') {
                    toDetail(item.goods, true)
                } else {
                    myApp.getCurrentView().router.load({
                        url: 'activity.html',
                        query: {name: item.name}
                    })
                }
            },
            onCartClick: function (event, goods) {
                event.preventDefault()
                event.stopPropagation()
                toAddCart(goods)
            }
        }

    });

    var ptrContent = $$(el + " .pull-to-refresh-content");
    ptrContent.on('refresh', function (event) {
        $.get(host + "/m/activity/query", {name: name}, function (result) {
            if (result.code == 200) {
                vue.activity = result.content
                $(".view[data-page='activity']  .navbar-from-right-to-center .center").text(vue.activity.title)
                $(".view[data-page='activity']  .navbar-on-center .center").text(vue.activity.title)
                $(".view[data-page='activity']  .navbar-from-right-to-center .right").css({visibility: "visible"})
                $(".view[data-page='activity']  .navbar-on-center .right").css({visibility: "visible"})
                $(".navbar .search.text").text(result.extra.search)
            } else {
                toast(result.msg);
            }
            myApp.pullToRefreshDone(ptrContent);

        });

    });
    $(".view[data-page='activity']  .right.refresh").click(function (event) {
        event.preventDefault()
        $(el + ' iframe').attr('src', $(el + ' iframe').attr('src'));
    })
    myApp.pullToRefreshTrigger(ptrContent)
}

function toScan() {
    scan.recognize(function (doc) {
        if (doc.indexOf('{') != -1 && doc.indexOf('}') != -1) {
            var obj = JSON.parse(doc)
            if (obj.type == 'goods') {
                toDetail({
                    goodsId: obj.content
                }, true)
            } else if (obj.type == 'order') {
                myApp.getCurrentView().router.load({
                    url: 'order.html'
                })
            } else if (obj.type == 'order-detail') {
                toOrderDetail({_id: obj.content}, null, true)
            } else if (obj.type == 'url') {
                myApp.getCurrentView().router.load({
                    url: 'web.html',
                    query: {url: obj.content, name: '網頁'}
                })
            }
        } else if (doc.indexOf('http') != -1 || doc.indexOf('https') != -1) {
            myApp.getCurrentView().router.load({
                url: 'web.html',
                query: {url: doc, name: '網頁'}
            })
        }

    }, function (error) {

    })
}


myApp.onPageInit('web', function (page) {
    console.log('web init')
    var pageId = generatePageId('web')
    $(".view[data-page='web'] .navbar-on-right .center").text(page.query.name)
    var vue = new Vue({
        el: pageId,
        data: {
            url: page.query.url
        },
        methods: {}
    });
    $(".view[data-page='web']  .right.refresh").click(function (event) {
        event.preventDefault()
        $(pageId + ' iframe').attr('src', $(pageId + ' iframe').attr('src'));
    })
})

myApp.onPageInit('activity', function (page) {
    var name = page.query.name
    console.log('activity ' + name + ' init')
    toActivity(generatePageId('activity'), name)

})

myApp.onPageInit('activity-preview', function (page) {
    console.log('activity-preview init')
    toActivity(generatePageId('activity-preview'), 'activity-preview')
})

function toCart(el) {
    var vue = new Vue({
        el: el,
        data: {
            carts: null,
            checks: [],
            checkAll: false,
            price: '0',
            quantity: '0'
        },
        watch: {
            'checks': function (val, oldVal) {
                this.checkAll = val.length == this.carts.length
                var quantity = 0;
                var price = 0;
                var vue = this
                this.carts.forEach(function (cart) {
                    if ($.inArray(cart._id, vue.checks) >= 0) {
                        price = (parseFloat(price) + cart.price * cart.quantity).toFixed(2)
                        quantity = parseInt(quantity) + parseInt(cart.quantity)
                    }
                })
                this.price = price;
                this.quantity = quantity
            }
        },
        methods: {
            onGoodsClick: function (event, cart) {
                event.preventDefault()
                toDetail({
                    title: cart.title,
                    goodsId: cart.goodsId,
                    images: [cart.image],
                    price: cart.price,
                    quantity: '1'
                }, true)
            },
            onQuantityContent: function (event, cart) {
                event.preventDefault()
                event.stopPropagation()
            },
            onQuantityInput: function (event, cart) {
                this.onQuantity(event, cart)

            },
            onQuantityDecrease: function (event, cart) {
                cart.quantity--
                this.onQuantity(event, cart)
            },
            onQuantityIncrease: function (event, cart) {
                cart.quantity++
                this.onQuantity(event, cart)
            },
            onQuantity: function (event, cart) {
                var vue = this
                if (cart.quantity < 1) {
                    toast('商品數量至少1件')
                    cart.quantity = 1
                    return
                }
                myApp.showIndicator()
                $.post(host + "/m/cart/edit", cart, function (result) {
                    if (result.code == 200) {
                        if ($.inArray(cart._id, vue.checks) >= 0) {
                            vue.checks.$remove(cart._id)
                            vue.checks.push(cart._id)
                        }
                        console.log("edit cart load");
                    } else {
                        toast(result.msg);
                        ;
                    }
                    myApp.hideIndicator()
                });
            },
            onItemDelete: function (event, cart) {
                event.preventDefault()
                event.stopPropagation()
                myApp.showIndicator()
                $.get(host + "/m/cart/delete", {cartId: cart._id}, function (result) {
                    if (result.code == 200) {
                        vue.checks.$remove(cart._id)
                        vue.carts.$remove(cart)
                        console.log("cart delete");
                    } else {
                        toast(result.msg);
                        ;
                    }
                    myApp.hideIndicator()
                });
            },
            onCheckAll: function (event) {
                if (event) event.preventDefault()
                this.checks.splice(0, this.checks.length);
                if (this.checkAll == false) {
                    var vue = this
                    this.carts.forEach(function (cart) {
                        vue.checks.push(cart._id)
                    })
                }
            },
            onBuy: function (event) {
                event.preventDefault()
                if (this.checks.length > 0) {
                    myApp.getCurrentView().router.load({
                        url: 'buy.html',
                        pushState: false,
                        query: {cartIds: JSON.parse(JSON.stringify(this.checks))}
                    })
                }
            }
        }
    });

    var ptrContent = $$(el + " .pull-to-refresh-content");
    ptrContent.on('refresh', function (event) {
        $.get(host + "/m/cart/queryList", {uid: user._id}, function (result) {
            if (result.code == 200) {
                // vue.checks.splice(0, vue.checks.length);
                vue.carts = result.content
                vue.checkAll = false
                vue.onCheckAll(null)
                console.log("cart load");
            } else {
                toast(result.msg);

            }
            myApp.pullToRefreshDone(ptrContent);
        });

    });
    myApp.pullToRefreshTrigger(ptrContent)

}


var onCartPageInit = myApp.onPageInit('cart', function (page) {
    console.log('cart init')
    gVue.badge3 = 0
    toCart(generatePageId('cart'))
})

var onCartPageReInit = myApp.onPageReinit('cart', function (page) {
    console.log('cart reinit')
    if (gVue.badge3 > 0) {
        gVue.badge3 = 0
        var ptrContent = $$(".page[data-page='cart'] .pull-to-refresh-content");
        myApp.pullToRefreshTrigger(ptrContent)
    }
})


myApp.onPageInit('cart-push', function (page) {
    console.log('cart-push init')
    toCart(generatePageId('cart-push'))
})


var onCategoryPageInit = myApp.onPageInit('category', function (page) {
    console.log('category init')
    var vue = new Vue({
        el: generatePageId('category'),
        data: {
            categories: null,
            category: null
        },
        methods: {
            onItemClick: function (event, category) {
                var vue = this
                vue.category = category
                if (!(vue.category.goodss.length > 0)) {
                    myApp.showIndicator()
                    $.get(host + "/m/goods/queryList", {
                        categoryId: vue.category.categoryId,
                        uid: user._id
                    }, function (result) {
                        if (result.code == 200) {
                            vue.category.goodss = result.content
                            console.log("category goods load");
                        } else {
                            toast(result.msg);
                            ;
                        }
                        myApp.hideIndicator()
                    });
                }
            },
            onGoodsClick: function (event, goods) {
                event.preventDefault()
                toDetail(goods, true)
            },
            onCartClick: function (event, goods) {
                event.preventDefault()
                event.stopPropagation()
                toAddCart(goods)
            }
        }
    })
    myApp.showIndicator()
    $.get(host + "/m/category/queryList", {uid: user._id}, function (result) {
        if (result.code == 200) {
            vue.categories = result.content
            vue.onItemClick(null, vue.categories[0])
            $(".navbar .search.text").text(result.extra.search)
            console.log("category load");
        } else {
            view2Init = false
            toast(result.msg);
        }
    });

    $(".view[data-page='category']  .right.scan").click(function (event) {
        event.preventDefault()
        toScan()
    })

})


myApp.onPageInit('search', function (page) {
    console.log('search init')
    var vue = new Vue({
        el: generatePageId('search'),
        data: {
            searchs: null,
        },
        methods: {
            onClear: function (event) {
                event.preventDefault()
                myApp.showIndicator()
                $.get(host + "/m/search/clear", {uid: user._id}, function (result) {
                    if (result.code == 200) {
                        vue.searchs.recentSearchs = null
                        console.log("search clear load");
                    } else {
                        toast(result.msg);
                    }
                    myApp.hideIndicator()
                });
            },
            onTextClick: function (event, search) {
                event.preventDefault()
                $(".view[data-page='search']  input.search.text").val(search.title)
                $(".view[data-page='search']  input.search.text").trigger($.Event('keypress', {keyCode: 13}));
            },
        }
    });
    myApp.showIndicator()
    $.get(host + "/m/search/queryList", {uid: user._id}, function (result) {
        if (result.code == 200) {
            vue.searchs = result.content
            console.log("search load");
        } else {
            toast(result.msg);
            ;
        }
        myApp.hideIndicator()
    });

    $(".view[data-page='search']  input.search.text").keypress(function (event) {
        if (event.keyCode == 13) {
            var text = $(event.currentTarget).val()
            if (text.length > 0) {
                myApp.getCurrentView().router.load({
                    url: 'search-detail.html',
                    query: {text: text}
                })
            }

        }

    })

})


myApp.onPageInit('search-detail', function (page) {
    console.log('search-detail init')
    var pageId = generatePageId('search-detail')
    $(pageId + " .page-content .goods img").height(($(pageId + " .page-content").width() - 1) / 2)
    var vue = new Vue({
        el: pageId,
        data: {
            goodss: null
        },
        methods: {
            onGoodsClick: function (event, goods) {
                event.preventDefault()
                toDetail(goods, true)
            },
            onCartClick: function (event, goods) {
                event.preventDefault()
                event.stopPropagation()
                toAddCart(goods)
            }
        }
    });

    $(".view[data-page='search-detail']  input.search.text").keypress(function (event) {
        if (event.keyCode == 13) {
            var text = $(event.currentTarget).val()
            if (text.length > 0) {
                myApp.showIndicator()
                $.get(host + "/m/search/query", {text: text, uid: user._id}, function (result) {
                    if (result.code == 200) {
                        vue.goodss = result.content
                        console.log("search load");
                    } else {
                        toast(result.msg);
                        ;
                    }
                    myApp.hideIndicator()
                });
            } else {
                vue.goodss = null
            }

        }

    })
    $(".view[data-page='search-detail']  input.search.text").val(page.query.text)
    $(".view[data-page='search-detail']  input.search.text").trigger($.Event('keypress', {keyCode: 13}));

})


myApp.onPageInit('category-detail', function (page) {
    console.log('category-detail init')
    var pageId = generatePageId('category-detail')
    $(pageId + " .page-content .goods img").height(($(pageId + " .page-content").width() - 1) / 2)
    $(".view[data-page='category-detail']  .navbar-on-right .center").text(page.query.categoryName)
    var vue = new Vue({
        el: pageId,
        data: {
            goodss: null
        },
        methods: {
            onGoodsClick: function (event, goods) {
                event.preventDefault()
                toDetail(goods, true)
            },
            onCartClick: function (event, goods) {
                event.preventDefault()
                event.stopPropagation()
                toAddCart(goods)
            }
        }
    });
    myApp.showIndicator()
    $.get(host + "/m/goods/queryList", {
        categoryId: page.query.categoryId,
        uid: user._id
    }, function (result) {
        if (result.code == 200) {
            vue.goodss = result.content
            console.log("category-detail  load");
        } else {
            toast(result.msg);
            ;
        }
        myApp.hideIndicator()
    });


})


myApp.onPageInit('shop-detail', function (page) {
    console.log('shop-detail init')
    var pageId = generatePageId('shop-detail')
    $(pageId + " .page-content .goods img").height(($(pageId + " .page-content").width() - 1) / 2)
    $(".view[data-page='shop-detail'] .navbar-on-right .center").text(page.query.shop)
    var vue = new Vue({
        el: pageId,
        data: {
            goodss: null
        },
        methods: {
            onGoodsClick: function (event, goods) {
                event.preventDefault()
                toDetail(goods, true)
            },
            onCartClick: function (event, goods) {
                event.preventDefault()
                event.stopPropagation()
                toAddCart(goods)
            }
        }
    });
    myApp.showIndicator()
    $.get(host + "/m/goods/queryList", {
        shop: page.query.shop,
        uid: user._id
    }, function (result) {
        if (result.code == 200) {
            vue.goodss = result.content
            console.log("shop-detail  load");
        } else {
            toast(result.msg);
            ;
        }
        myApp.hideIndicator()
    });


})


var onMePageInit = myApp.onPageInit('me', function (page) {
    console.log('me init')

    var vue = new Vue({
        el: generatePageId('me'),
        data: {
            user: user
        },
        methods: {}
    });

})


myApp.onPageInit('setting', function (page) {
    console.log('setting init')
    var vue = new Vue({
        el: generatePageId('setting'),
        data: {
            user: user
        },
        methods: {}
    });

})


function toEditUser(user) {
    myApp.showIndicator()
    $.post(host + "/m/user/edit", user, function (result) {
        if (result.code == 200) {
            storeUser(result.content)
            console.log("user edit load");
            myApp.getCurrentView().router.back()
        } else {
            toast(result.msg);
            ;
        }
        myApp.hideIndicator()
    });

}

myApp.onPageInit('setting-name', function (page) {
    console.log('setting-name init')
    var vue = new Vue({
        el: generatePageId('setting-name'),
        data: {
            user: JSON.parse(JSON.stringify(user)),
        },
        methods: {}
    });
    $(".view[data-page='setting-name']  .right").click(function (event) {
        event.preventDefault()
        toEditUser(vue.user)
    })
})


myApp.onPageInit('setting-phone', function (page) {
    console.log('setting-phone init')
    var vue = new Vue({
        el: generatePageId('setting-phone'),
        data: {
            user: JSON.parse(JSON.stringify(user)),
        },
        methods: {}
    });
    $(".view[data-page='setting-phone']  .right").click(function (event) {
        event.preventDefault()
        toEditUser(vue.user)
    })
})

myApp.onPageInit('setting-password', function (page) {
    console.log('setting-password init')
    var vue = new Vue({
        el: generatePageId('setting-password'),
        data: {
            user: JSON.parse(JSON.stringify(user)),
        },
        methods: {}
    });
    $(".view[data-page='setting-password']  .right").click(function (event) {
        event.preventDefault()
        toEditUser(vue.user)
    })
})


myApp.onPageInit('buy', function (page) {
    console.log('buy init')
    var vue = new Vue({
        el: generatePageId('buy'),
        data: {
            order: null
        },
        methods: {
            onAddressClick: function (event) {
                event.preventDefault()
                myApp.getCurrentView().router.load({
                    url: 'address.html',
                    query: {select: true, callback: this.onAddressSelect}
                })
            },
            onCreateClick: function (event) {
                event.preventDefault()
                if (this.order.address) {
                    if (this.order.items.length > 0) {
                        myApp.showIndicator()
                        var vue = this
                        $.post(host + "/m/order/create", {
                            uid: user._id,
                            order: JSON.stringify(this.order)
                        }, function (result) {
                            if (result.code == 200) {
                                gVue.badge3 = vue.order.items.length
                                myApp.getCurrentView().router.back({
                                    animatePages: false
                                })
                                myApp.getCurrentView().router.load({
                                    url: 'order.html'
                                })
                                console.log("buy create load");
                            } else {
                                toast(result.msg);

                            }
                            myApp.hideIndicator()
                        });
                    } else {
                        toast('請選擇商品')
                    }
                } else {
                    toast('請選擇收貨地址')
                }

            },
            onGoodsClick: function (event, item) {
                event.preventDefault()
                toDetail({
                    title: item.title,
                    goodsId: item.goodsId,
                    images: [item.image],
                    price: item.price,
                    quantity: '1'
                }, true)
            },
            onAddressSelect: function (address) {
                this.$set('order.address', address)
            }

        }
    });

    myApp.showIndicator()
    $.post(host + "/m/order/build", {uid: user._id, cartIds: page.query.cartIds}, function (result) {
        if (result.code == 200) {
            vue.order = result.content
            console.log("buy load");
        } else {
            toast(result.msg);
            ;
        }
        myApp.hideIndicator()
    });

})


myApp.onPageInit('order', function (page) {
    console.log('order init')
    var pageId = generatePageId('order')
    var vue = new Vue({
        el: pageId,
        data: {
            orders: null
        },
        methods: {
            onItemClick: function (event, order) {
                event.preventDefault()
                toOrderDetail(order, this.onRefresh, true)
            },
            onRefresh: function (order) {
                var ptrContent = $$(pageId + " .pull-to-refresh-content");
                myApp.pullToRefreshTrigger(ptrContent)
            }
        }
    });

    var ptrContent = $$(pageId + " .pull-to-refresh-content");
    ptrContent.on('refresh', function (event) {
        $.get(host + "/m/order/queryList", {uid: user._id}, function (result) {
            if (result.code == 200) {
                vue.orders = result.content
                console.log("order load");
            } else {
                toast(result.msg);

            }
            myApp.pullToRefreshDone(ptrContent);

        });

    });
    myApp.pullToRefreshTrigger(ptrContent)

    $(".view[data-page='order']  .right.home").click(function (event) {
        event.preventDefault()
        myApp.getCurrentView().router.back({
            url: 'index.html',
            force: true
        })
        setTimeout(function () {
            $(".tab-link.home")[0].click()
        }, 600)

    })

})


myApp.onPageInit('order-detail', function (page) {
    console.log('order-detail init')
    var vue = new Vue({
        el: generatePageId('order-detail'),
        data: {
            order: page.query.order,
            extra: {pay: {text: '貨到付款', hint: '（支持現金或者POS機）'}, delivery: {text: '配送時間', hint: '（接受訂單後40分鐘內到達）'}}
        },
        methods: {
            onCancelClick: function (event) {
                event.preventDefault()
                var vue = this
                myApp.confirm('一旦取消無法恢復', '取消訂單', function () {
                    myApp.showIndicator()
                    $.get(host + "/m/order/cancel", {uid: user._id, orderId: vue.order._id}, function (result) {
                        if (result.code == 200) {
                            if (page.query.callback) {
                                page.query.callback(vue.order)
                            }
                            myApp.getCurrentView().router.back()
                            console.log("order cancel");
                        } else {
                            toast(result.msg);
                        }
                        myApp.hideIndicator()
                    });
                });

            },
            onGoodsClick: function (event, item) {
                event.preventDefault()
                toDetail({
                    title: item.title,
                    goodsId: item.goodsId,
                    images: [item.image],
                    price: item.price,
                    quantity: '1'
                }, true)
            }
        }
    });

    if (page.query.load) {
        myApp.showIndicator()
        $.get(host + "/m/order/query", {orderId: page.query.order._id}, function (result) {
            if (result.code == 200) {
                vue.order = result.content
                vue.extra = result.extra
                console.log("order-detail load");
            } else {
                toast(result.msg);

            }
            myApp.hideIndicator()
        });
    }

})

myApp.onPageInit('address', function (page) {
    console.log('address init')
    var pageId = generatePageId('address')
    var vue = new Vue({
        el: pageId,
        data: {
            addresses: null,
            select: page.query.select
        },
        methods: {
            onItemClick: function (event, address) {
                event.preventDefault()
                if (this.select) {
                    page.query.callback(JSON.parse(JSON.stringify(address)))
                    myApp.getCurrentView().router.back()
                } else {
                    myApp.getCurrentView().router.load({
                        url: 'address-edit.html',
                        query: {address: address, callback: this.onRefresh}
                    })
                }

            },
            onItemEdit: function (event, address) {
                event.preventDefault()
                event.stopPropagation()
                myApp.getCurrentView().router.load({
                    url: 'address-edit.html',
                    query: {address: address, callback: this.onRefresh}
                })
            },
            onItemDelete: function (event, address) {
                event.preventDefault()
                event.stopPropagation()
                myApp.showIndicator()
                $.get(host + "/m/address/delete", {addressId: address._id}, function (result) {
                    if (result.code == 200) {
                        vue.addresses.$remove(address)
                        console.log("addresses delete");
                    } else {
                        toast(result.msg);
                        ;
                    }
                    myApp.hideIndicator()
                });
            },
            onRefresh: function (address) {
                var ptrContent = $$(pageId + " .pull-to-refresh-content");
                myApp.pullToRefreshTrigger(ptrContent)
            }
        }
    });

    var ptrContent = $$(pageId + " .pull-to-refresh-content");
    ptrContent.on('refresh', function (event) {
        $.get(host + "/m/address/queryList", {uid: user._id}, function (result) {
            if (result.code == 200) {
                vue.addresses = result.content
                console.log("addresses load");
            } else {
                toast(result.msg);

            }
            myApp.pullToRefreshDone(ptrContent);

        });

    });
    myApp.pullToRefreshTrigger(ptrContent)

    $(".view[data-page='address']  .right.add").click(function (event) {
        event.preventDefault()
        myApp.getCurrentView().router.load({
            url: 'address-edit.html',
            query: {callback: vue.onRefresh}
        })
    })

})

myApp.onPageInit('address-edit', function (page) {
    console.log('address-edit init')
    var vue = new Vue({
        el: generatePageId('address-edit'),
        data: {
            address: page.query.address ? page.query.address : {uid: user._id}
        },
        methods: {}

    });
    $(".view[data-page='address-edit']  .right.edit").click(function (event) {
        event.preventDefault()
        var nameReg = /^.{1,50}$/;
        if (vue.address.name == null || !nameReg.test(vue.address.name)) {
            toast('請輸入30字內名字');
            return
        }

        // var phoneReg = /^(\+97[\s]{0,1}[\-]{0,1}[\s]{0,1}1|0)50[\s]{0,1}[\-]{0,1}[\s]{0,1}[1-9]{1}[0-9]{6}$/;
        var phoneReg = /^.{1,50}$/;
        if (vue.address.phone == null || !phoneReg.test(vue.address.phone)) {
            toast('請輸入有效手機號');
            return
        }

        // var postReg = /^[0-9]{5}(?:-[0-9]{4})?$/;
        var postReg = /^.{1,50}$/;
        if (vue.address.post == null || !postReg.test(vue.address.post)) {
            toast('請輸入有效郵政編碼');
            return
        }

        var contentReg = /^.{5,300}$/;
        if (vue.address.content == null || !contentReg.test(vue.address.content)) {
            toast('請輸入大於5個字的有效詳細地址');
            return
        }

        myApp.showIndicator();
        $.post(host + (vue.address._id ? '/m/address/edit' : '/m/address/add'), vue.address, function (result) {
            if (result.code == 200) {
                page.query.callback(vue.address)
                console.log("address edit load")
                myApp.getCurrentView().router.back()
            } else {
                toast(result.msg);
            }
            myApp.hideIndicator()
        });
    })

})


function toAddCart(goods, callback) {
    myApp.showIndicator()
    var cart = {
        uid: user._id,
        goodsId: goods.goodsId,
        title: goods.title,
        price: goods.price,
        quantity: goods.quantity,
        image: goods.images[0]
    }
    $.post(host + "/m/cart/add", cart, function (result) {
        if (result.code == 200) {
            gVue.badge3++;
            console.log("add cart load");
            toast('添加購物車成功')
        } else {
            toast(result.msg);

        }
        if (callback) {
            callback(result.code == 200)
        }
        myApp.hideIndicator()
    });
}

function toDetail(goods, load) {
    myApp.getCurrentView().router.load({
        url: 'detail.html',
        query: {goods: JSON.parse(JSON.stringify(goods)), load: load}
    })
}

function toOrderDetail(order, callback, load) {
    myApp.getCurrentView().router.load({
        url: 'order-detail.html',
        query: {order: JSON.parse(JSON.stringify(order)), callback: callback, load: load}
    })
}


myApp.onPageInit('detail', function (page) {
    console.log('detail init')
    var pageId = generatePageId('detail')
    $(pageId + " .page-content .banner").height($(pageId + " .page-content").width())
    var popWidth = $(".popover-qrcode").width()
    $(".popover-qrcode").height(popWidth)
    qrWidth = popWidth - 24
    var vue = new Vue({
        el: pageId,
        data: {
            goods: page.query.goods
        },
        methods: {
            onImageClick: function (event, index) {
                // var myPhotoBrowserPopup = myApp.photoBrowser({
                //     photos: this.goods.images,
                //     initialSlide: index,
                //     type: 'popup'
                // });
                // myPhotoBrowserPopup.open();
            },
            onCategoryClick: function (event) {
                event.preventDefault()
                myApp.getCurrentView().router.load({
                    url: 'category-detail.html',
                    query: {categoryId: this.goods.categoryId, categoryName: this.goods.categoryName}
                })
            },
            onShopClick: function (event) {
                event.preventDefault()
                myApp.getCurrentView().router.load({
                    url: 'shop-detail.html',
                    query: {shop: this.goods.shop}
                })
            },
            onCartClick: function (event) {
                event.preventDefault()
                toAddCart(this.goods, function (success) {
                    if (success) {
                        myApp.getCurrentView().router.back()
                    }
                })
            }

        }
    });
    if (page.query.load) {
        myApp.showIndicator()
        $.get(host + "/m/goods/query", {goodsId: page.query.goods.goodsId}, function (result) {
            if (result.code == 200) {
                vue.goods = result.content
                $('.qrcode').empty()
                $('.qrcode').qrcode({
                    width: qrWidth,
                    height: qrWidth,
                    text: JSON.stringify({type: 'goods', content: vue.goods.goodsId})
                })
                console.log("detail load");
            } else {
                toast(result.msg);

            }
            myApp.hideIndicator()
        });
    } else {
        $('.qrcode').empty()
        $('.qrcode').qrcode({
            width: qrWidth,
            height: qrWidth,
            text: JSON.stringify({type: 'goods', content: vue.goods.goodsId})
        })
    }
})

