var express = require('express');
var router = express.Router();
var BookItem = require('../proxy/bookItem');
var models = require('../models');
var BookItemModel = models.BookItem;
var jwtauth = require('../selfMiddleware/jwtauth');

router.post('/addBookItem*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    var newBookItem = {};
    newBookItem.bookId = res.query.bookId;
    newBookItem.content = req.query.content;
    newBookItem.charge = req.query.charge;

    BookItem.newAndSave(newBookItem, function (err, book) {
        if (err) {
            res.statusCode = 401;
            res.json({
                msg: '后台错误'
            });
            return res;
        } else {
            res.json({
                msg: '添加账本条目成功'
            })
        }
    })
});

router.get('/getBookItem*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) { 
    BookItem.querySomeBookItemByBook(res.query.bookId, req.query.pageIndex, req.query.pageSize, function (err, bookItemList) {
        if (err) {
            console.log(err)
            res.statusCode = 401;
            res.json({
                msg: '后台错误'
            });
            return res;
        } else {
            res.json(bookItemList)
        }
    })
});

router.put('/editBookItem*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    var modifiedBookItem = {};
    modifiedBookItem.bookId = res.query.bookId;
    modifiedBookItem.content = req.query.content;
    modifiedBookItem.charge = req.query.charge;

    BookItem.editBookBybookId(req.query.bookItemId, modifiedBook, function (err, query){
        if (err) {
            res.statusCode = 401;
            res.json({
                msg: '后台错误'
            });
            return res;
        } else {
            res.json({
                msg: '修改账本细则成功'
            })
        }
    })
});

router.delete('/delBookItem', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    BookItem.delBookBybookId(req.query.bookItemId, function (err, query) {
        if (err) {
            res.statusCode = 401;
            res.json({
                msg: '后台错误'
            });
            return res;
        } else {
            res.json({
                msg: '删除成功'
            });
        }
    })
})


module.exports = router;