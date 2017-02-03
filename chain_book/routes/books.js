var express = require('express');
var router = express.Router();
var Book = require('../proxy/book');
var models = require('../models');
var BookModel = models.Book;
var jwtauth = require('../selfMiddleware/jwtauth');

router.post('/addBook*', jwtauth.authIsUser, function (req, res, next) {
    var newBook = {};
    newBook.founderId = res.locals.user._id;
    newBook.title = req.query.booksTitle;
    newBook.place = req.query.booksPlace;
    newBook.intro = req.query.booksIntro;
    newBook.picUrl = req.query.booksPic;
    
    Book.newAndSave(newBook, function (err, book) {
        if (err) {
            res.statusCode = 401;
            res.json({
                msg: '后台错误'
            });
            return res;
        } else {
            res.json({
                msg: '添加成功'
            })
        }
    })
});

router.put('/editBookInfo*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    // var modifiedBook = new BookModel();
    var modifiedBook = {};
    modifiedBook.founderId = res.locals.user._id;
    modifiedBook.title = req.query.booksTitle;
    modifiedBook.place = req.query.booksPlace;
    modifiedBook.intro = req.query.booksIntro;
    modifiedBook.picUrl = req.query.booksPic;

    Book.editBookById(req.query.bookId, modifiedBook, function (err, query){
        if (err) {
            res.statusCode = 401;
            res.json({
                msg: '后台错误'
            });
            return res;
        } else {
            res.json({
                msg: '修改成功'
            })
        }
    })
});

router.delete('/delBook', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    Book.delBookById(req.query.bookId, function (err, query) {
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