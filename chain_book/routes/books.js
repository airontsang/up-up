var express = require('express');
var router = express.Router();
var Book = require('../proxy/book');
var jwtauth = require('../selfMiddleware/jwtauth');

router.post('/addBook*', jwtauth, function (req, res, next) {
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

router.put('/editBookInfo*', jwtauth, function (req, res, next) {
    var modifiedBook = {};


})

module.exports = router;