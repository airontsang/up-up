var express = require('express');
var moment = require('moment');
// var smushit = require('node-smushit');
var imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
var router = express.Router();
var Book = require('../proxy/book');
var async = require('async');
var BookItem = require('../proxy/bookItem');
var models = require('../models');
var BookModel = models.Book;
var jwtauth = require('../selfMiddleware/jwtauth');

var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var path = require('path');

//图片上传，后要添加是否为user的判断
router.post('/bookPic/uploading', jwtauth.authIsUser, function (req, res, next) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: './public/files/'
    });
    form.parse(req, function (err, fields, files) {
        console.log(files.images[0].originalFilename);
        console.log(files.images[0].path);
        var _tmp = files.images[0].originalFilename.split('.');
        var type = _tmp[_tmp.length - 1];
        var tmp_name = (Date.parse(new Date()) / 1000) + '' + (Math.round(Math.random() * 9999)) + '.' + type; //生成随机名称
        var newPath = './public/files/' + tmp_name;
        fs.rename(files.images[0].path, newPath, function (err) {
            if (err) {
                console.log('rename error: ' + err);
            } else {
                console.log('rename ok');
                imagemin([newPath], './public/files', {
                    plugins: [
                        imageminJpegtran(),
                        imageminPngquant({
                            quality: '65-80'
                        })
                    ]
                }).then((files => {
                    console.log(files)
                    res.json({
                        error_code: 0,
                        msg: "上传成功",
                        name: tmp_name
                    })
                }), err => {
                    res.json({
                        error_code: 1018,
                        msg: "压缩失败",
                        name: tmp_name
                    })
                })
            }
        });
    });
});

router.post('/addBook*', jwtauth.authIsUser, function (req, res, next) {
    var newBook = {};
    newBook.founderId = res.locals.user._id;
    newBook.title = req.body.bookTitle;
    newBook.place = req.body.bookPlace;
    newBook.intro = req.body.bookIntro;
    newBook.partyTime = moment(req.body.partyTime).format();
    newBook.picUrl = req.body.bookPic;

    Book.newAndSave(newBook, function (err, book) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                msg: '添加成功'
            })
        }
    })
});

router.get('/getBooks*', jwtauth.authIsUser, function (req, res, next) {
    Book.queryBookByFounder(res.locals.user._id, req.query.pageIndex, req.query.pageSize, function (err, book) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                data: book
            });
        }
    })
});


router.get('/getPublicedBooks*', jwtauth.authIsUser, function (req, res, next) {
    Book.queryPublicedBook(res.locals.user._id, req.query.pageIndex, req.query.pageSize, function (err, book) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                data: book
            });
        }
    })
});

router.get('/onePublicedBook*', function (req, res, next) {
    Book.onePublicedBook(req.query.bookId, function (err, book) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                data: book
            });
        }
    })
});

router.get('/getIndexBook*', jwtauth.authIsUser, function (req, res, next) {
    function getIndexBookId(callback) {
        Book.queryBookByFounder(res.locals.user._id, 1, 1, function (err, book) {
            callback(null, book);
        })
    }

    function getFourBookItem(arg1, callback) {
        console.log(arg1)
        if (arg1.length == 0) {
            callback(null, null)
        } else {
            BookItem.querySomeBookItemByBook(arg1[0]._id, 1, 4, function (err, bookItems) {
                var indexBook = {}
                indexBook.info = arg1[0]
                indexBook.bookItems = bookItems
                callback(null, indexBook)
            })
        }

    }

    async.waterfall([
        getIndexBookId,
        getFourBookItem,
    ], function (err, result) {
        if (!err) {
            res.json({
                    error_code: 0,
                    data: result
                })
                // setTimeout(function() {
                //     res.json({
                //         error_code: 0,
                //         data: result
                //     })
                // }, 4000)
        } else {
            res.json({
                error_code: 1001,
                msg: err
            })
        }
    })

});

router.get('/getBookPic*', function (req, res, next) {
    fs.readFile('./public/files/' + req.query.fileName, function (err, data) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        }
        console.log('读取成功');
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });
        res.write(data, 'binary');
        res.end();
        return;
    })
});

router.put('/editBookInfo*', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    // var modifiedBook = new BookModel();
    var modifiedBook = {};
    modifiedBook.founderId = res.locals.user._id;
    modifiedBook.title = req.body.bookTitle;
    modifiedBook.place = req.body.bookPlace;
    modifiedBook.intro = req.body.bookIntro;
    modifiedBook.partyTime = moment(req.body.partyTime).format();
    modifiedBook.picUrl = req.body.bookPic;

    Book.editBookById(req.body.bookId, modifiedBook, function (err, query) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res;
        } else {
            res.json({
                error_code: 0,
                msg: query
            })
        }
    })

});

router.delete('/delBook', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res, next) {
    // Book.delBookById(req.query.bookId, function (err, query) {
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

    function delBook(callback) {
        Book.delBookById(req.query.bookId, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result);
            }
        })
    }

    function delBookItem(arg1, callback) {
        BookItem.delAllBookItem(req.query.bookId, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result)
            }
        })
    }

    async.waterfall([
        delBook,
        delBookItem,
    ], function (err, result) {
        if (!err) {
            res.json({
                error_code: 0,
                data: result
            })
        } else {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            })
        }
    })
})


module.exports = router;