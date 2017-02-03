var express = require('express');
var User = require('../proxy/user');
var Book = require('../proxy/book');
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
                    res.statusCode = 401
                    res.json(err)
                    return res
                } else if (!user) {
                    res.statusCode = 401
                    res.json('用户验证错误，请重新登录')
                    return res
                } else {
                    res.locals.user = user
                    next(); //解析正确的next()
                }
            })
        } catch (err) {
            console.log(err)
            res.statusCode = 401
            res.json('用户验证错误，请重新登录')
            return res
                // return next(); //遇到了解析错误的next()
        }
    } else {
        next(); //没有token的next()
    }
}

var authIsBookOwner = function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token, 'MY_SECRET_STRING');
            // handle token here
            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', 400);
            }
            Book.getBookById(req.query.bookId, function (err, book) {
                if (err) {
                    res.statusCode = 401
                    res.json(err)
                    return res
                } else {
                    if (!book) {
                        res.statusCode = 401
                        res.json('账本不存在')
                        return res
                    }
                    else if (book.founderId.toString() != res.locals.user._id.toString()) {                  
                        res.statusCode = 401
                        res.json('无权限操作该账本')
                        return res
                    } else {
                        console.log('属于该用户');
                        next(); //解析正确的next()
                    }
                }
            })
        } catch (err) {
            console.log(err)
            res.statusCode = 401
            res.json('用户验证错误，请重新登录')
            return res
                // return next(); //遇到了解析错误的next()
        }
    } else {
        next(); //没有token的next()
    }
}

exports.authIsUser = authIsUser;
exports.authIsBookOwner = authIsBookOwner;