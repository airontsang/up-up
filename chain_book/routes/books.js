var express = require('express');
var router = express.Router();
var Book = require('../proxy/book');
var models = require('../models');
var BookModel = models.Book;
var jwtauth = require('../selfMiddleware/jwtauth');

var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

router.post('/bookPic/uploading', function (req, res, next) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './public/files/'});
    form.parse(req, function(err, fields, files) {
        console.log(files.images[0].originalFilename);
        console.log(files.images[0].path);
        var _tmp = files.images[0].originalFilename.split('.');
        var type = _tmp[_tmp.length-1];
        var tmp_name = (Date.parse(new Date()) / 1000) + '' + (Math.round(Math.random() * 9999)) + '.' + type;//生成随机名称
        var newPath = './public/files/' + tmp_name;
        fs.rename(files.images[0].path, newPath, function(err) {
          if(err){
            console.log('rename error: ' + err);
          } else {
            console.log('rename ok');
          }
        });
      res.json({
          msg: "上传成功",
          name: tmp_name
      })
      console.log("完成")
   });
});
router.post('/addBook*', jwtauth.authIsUser, function (req, res, next) {
    var newBook = {};
    newBook.founderId = res.locals.user._id;
    newBook.title = req.query.bookTitle;
    newBook.place = req.query.bookPlace;
    newBook.intro = req.query.bookIntro;
    newBook.picUrl = req.query.bookPic;
    
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

router.get('/getBooks*', jwtauth.authIsUser, function (req, res, next) { 
    Book.queryBookByPage(res.locals.user._id, req.query.pageIndex, req.query.pageSize, function (err, book) {
        if (err) {
            console.log(err)
            res.statusCode = 401;
            res.json({
                msg: '后台错误'
            });
            return res;
        } else {
            res.json(book)
        }
    })
});

router.put('/editBookInfo*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    // var modifiedBook = new BookModel();
    var modifiedBook = {};
    modifiedBook.founderId = res.locals.user._id;
    modifiedBook.title = req.query.bookTitle;
    modifiedBook.place = req.query.bookPlace;
    modifiedBook.intro = req.query.bookIntro;
    modifiedBook.picUrl = req.query.bookPic;

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