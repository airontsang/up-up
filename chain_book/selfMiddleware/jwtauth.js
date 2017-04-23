var express = require('express');
var User = require('../proxy/user');
var Book = require('../proxy/book');
var BookItem = require('../proxy/bookItem');
var jwt = require('jwt-simple')

var authIsUser = function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token, 'MY_SECRET_STRING');
            // handle token here
            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', 400);
            }
            User.getUserById(decoded.iss, function (err, user) {
                if (err) {
                    res.json({
                        error_code: 1001,
                        msg: '数据库操作错误'
                    });
                    return res
                } else if (!user) {
                    res.json({
                        error_code: 1002,
                        msg: '用户不存在'
                    });
                    return res
                } else {
                    res.locals.user = user
                    next(); //解析正确的next()
                }
            })
        } catch (err) {
            res.json({
                error_code: 1005,
                msg: 'token解析错误'
            });
            return res
                // return next(); //遇到了解析错误的next()
        }
    } else {
        res.json({
            error_code: 1005,
            msg: 'token解析错误'
        });
        return res
            // next(); //没有token的next()
    }
}

var authIsBookOwner = function (req, res, next) {
    Book.getBookById(req.query.bookId, function (err, book) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res
        } else {
            if (!book) {
                res.json({
                    error_code: 1012,
                    msg: '账本不存在'
                });
                return res
            } else if (book.founderId.toString() != res.locals.user._id.toString()) {
                res.json({
                    error_code: 1016,
                    msg: '无权限操作该账本'
                });
                return res
            } else {
                console.log('属于该用户');
                next(); //解析正确的next()
            }
        }
    })
}

var authIsBookItem = function (req, res, next) {
    BookItem.getBookItemById(req.query.bookItemId, function (err, bookItem) {
        if (err) {
            res.json({
                error_code: 1001,
                msg: '数据库操作错误'
            });
            return res
        } else {
            if (!bookItem) {
                res.json({
                    error_code: 1022,
                    msg: '账本条目不存在'
                });
                return res
            } else {
                next(); //解析正确的next()
            }
        }
    })
}

exports.authIsUser = authIsUser;
exports.authIsBookOwner = authIsBookOwner;
exports.authIsBookItem = authIsBookItem;