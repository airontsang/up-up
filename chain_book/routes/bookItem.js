var express = require('express');
var router = express.Router();
var BookItem = require('../proxy/bookItem');
var Book = require('../proxy/book');
var moment = require('moment');
var async = require('async');
var jwtauth = require('../selfMiddleware/jwtauth');

router.post('/addBookItem*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    var newBookItem = {};
    newBookItem.bookId = req.body.bookId;
    newBookItem.content = req.body.content;
    newBookItem.charge = req.body.charge;
    newBookItem.type = req.body.type;
    newBookItem.tag = req.body.tag;
    newBookItem.happen_at = moment(req.body.happen_at).format();

    function saveBookItem(cb) {
        BookItem.newAndSave(newBookItem, function (err, doc) {
            if (err) {
                console.log(err)
            }
            cb(null, doc) //doc可能有值返回，但不重要
        })
    }
    function count(arg1, cb) {
        BookItem.allBookItemById(newBookItem.bookId, function (err, doc) {
            var sum, spend, balance = 0;
            var sheet = {};
            sheet.sum = 0;
            sheet.spend = 0;
            sheet.balance = 0;

            doc.forEach(function (element) {
                if (element.type) {
                    sheet.sum = sheet.sum + Number(element.charge)
                } else {
                    sheet.spend = sheet.spend + Number(element.charge)
                }
            }, sheet);
            sheet.balance = sheet.sum - sheet.spend;
            cb(null, sheet)
        })
    }
    function toBook(arg1, cb) {
        Book.writeMoney(newBookItem.bookId, arg1, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result);
                cb(null, result)
            }
        })
    }
    async.waterfall([
        saveBookItem,
        count,
        toBook
    ], function (err, result) {
        if (!err) {
            console.log(result)
            res.json({
                error_code: 0,
                data: result
            })
        } else {
            console.log("数据库错误")
            res.json({
                error_code: 1000,
                msg: err
            })
        }
    })
});

router.get('/getBookItem*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    BookItem.querySomeBookItemByBook(req.query.bookId, req.query.pageIndex, req.query.pageSize, function (err, bookItemList) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                data: bookItemList
            });
        }
    })
});

router.put('/editBookItem*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    var modifiedBookItem = {};
    modifiedBookItem.bookId = req.body.bookId;
    modifiedBookItem.content = req.body.content;
    modifiedBookItem.charge = req.body.charge;
    modifiedBookItem.type = req.body.type;
    modifiedBookItem.tag = req.body.tag;
    modifiedBookItem.happen_at = moment(req.body.happen_at).format();

    // BookItem.editBookItemBybookId(req.query.bookItemId, modifiedBookItem, function (err, query) {
    //     if (err) {
    //         res.json({
    //             error_code: 1001,
    //             msg: '数据库操作错误'
    //         });
    //         return res;
    //     } else {
    //         res.json({
    //             error_code: 0,
    //             msg: '修改账本细则成功'
    //         })
    //     }
    // })
    // function previousData (cb) {
    //     BookItem.getItem(req.body.bookItemId, function (err, query){
    //         if (err) {
    //             cb(err, null)
    //         } else {
    //             var previous = {}
    //             previous.type = query.type;
    //             previous.charge = query.charge
    //             cb(null, previous)
    //         }
    //     })
    // }
    function editBookItem(cb) {
        
        BookItem.editBookItemBybookId(req.body.bookItemId, modifiedBookItem, function (err, query) {
            if (err) {
                cb(err, null)
            } else {
                cb(null, query)
            }
        })
    }
    function count(arg1, cb) {
        BookItem.allBookItemById(req.body.bookId, function (err, doc) {
            var sum, spend, balance = 0;
            var sheet = {};
            sheet.sum = 0;
            sheet.spend = 0;
            sheet.balance = 0;
            doc.forEach(function (element) {
                if (element.type) {
                    sheet.sum = sheet.sum + Number(element.charge)
                } else {
                    sheet.spend = sheet.spend + Number(element.charge)
                }
            }, sheet);
            sheet.balance = sheet.sum - sheet.spend;
            cb(null, sheet)
        })
    }
    function toBook(arg1, cb) {
        Book.writeMoney(req.body.bookId, arg1, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result);
                cb(null, result)
            }
        })
    }
    async.waterfall([
        editBookItem,
        count,
        toBook
    ], function (err, result) {
        if (!err) {
            console.log(result)
            res.json({
                error_code: 0,
                data: result
            })
        } else {
            console.log("数据库错误")
            res.json({
                error_code: 1000,
                msg: err
            })
        }
    })
});

router.delete('/delBookItem', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    // BookItem.delBookItemBybookId(req.query.bookItemId, function (err, query) {
    //     if (err) {
    //         res.json({
    //             error_code: 1001,
    //             msg: '数据库操作错误'
    //         });
    //         return res;
    //     } else {
    //         res.json({
    //             error_code: 0,
    //             msg: '删除成功'
    //         });
    //     }
    // })

    function delBookItem(cb) {
        BookItem.delBookItemBybookId(req.query.bookItemId, function (err, query) {
            if (err) {
                cb(err, null)
            } else {
                console.log("删除结果")
                console.log(query);
                cb(null, query)
            }
        })
    }
    function count(arg1, cb) {
        BookItem.allBookItemById(req.query.bookId, function (err, doc) {
            var sum, spend, balance = 0;
            var sheet = {};
            sheet.sum = 0;
            sheet.spend = 0;
            sheet.balance = 0;
            doc.forEach(function (element) {
                if (element.type) {
                    sheet.sum = sheet.sum + Number(element.charge)
                } else {
                    sheet.spend = sheet.spend + Number(element.charge)
                }
            }, sheet);
            sheet.balance = sheet.sum - sheet.spend;
            cb(null, sheet)
        })
    }
    function toBook(arg1, cb) {
        Book.writeMoney(req.query.bookId, arg1, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result);
                cb(null, result)
            }
        })
    }
    async.waterfall([
        delBookItem,
        count,
        toBook
    ], function (err, result) {
        if (!err) {
            res.json({
                error_code: 0,
                data: result
            })
        } else {
            console.log("数据库错误")
            res.json({
                error_code: 1000,
                msg: err
            })
        }
    })
})


module.exports = router;