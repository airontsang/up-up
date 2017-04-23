var express = require('express');
var router = express.Router();
var BookItem = require('../proxy/bookItem');
var jwtauth = require('../selfMiddleware/jwtauth');

router.post('/addBookItem*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    var newBookItem = {};
    newBookItem.bookId = req.query.bookId;
    newBookItem.content = req.query.content;
    newBookItem.charge = req.query.charge;

    BookItem.newAndSave(newBookItem, function (err, book) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                msg: '添加账本条目成功'
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
                bookItemList: bookItemList
            });
        }
    })
});

router.put('/editBookItem*', [jwtauth.authIsUser, jwtauth.authIsBookOwner, jwtauth.authIsBookItem], function (req, res, next) {
    var modifiedBookItem = {};
    modifiedBookItem.bookId = req.query.bookId;
    modifiedBookItem.content = req.query.content;
    modifiedBookItem.charge = req.query.charge;

    BookItem.editBookItemBybookId(req.query.bookItemId, modifiedBookItem, function (err, query) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                msg: '修改账本细则成功'
            })
        }
    })
});

router.delete('/delBookItem', [jwtauth.authIsUser, jwtauth.authIsBookOwner, jwtauth.authIsBookItem], function (req, res, next) {
    BookItem.delBookItemBybookId(req.query.bookItemId, function (err, query) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                msg: '删除成功'
            });
        }
    })
})


module.exports = router;