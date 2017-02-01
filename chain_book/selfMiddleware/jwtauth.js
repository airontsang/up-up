var express = require('express');
var User = require('../proxy/user')
var jwt = require('jwt-simple');

module.exports = function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token, 'MY_SECRET_STRING');
            // handle token here
            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', 400);
            }
            User.getUserByloginId(decoded.iss, function (err, user) {
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
                        next();     //解析正确的next()
                    }
                })
                // UserModel.get(decoded.iss, function (err, user) {
                //     if (err) {
                //         res.statusCode = 401
                //         res.json(err)
                //         return res
                //     }
                //     if (!user) {
                //         res.statusCode = 401
                //         res.json('用户验证错误，请重新登录')
                //         return res
                //     }
                //     res.locals.user = user
                //     next();     //解析正确的next()
                // })
        } catch (err) {
            console.log(err)
            return next(); //遇到了解析错误的next()
        }
    } else {
        next(); //没有token的next()
    }
}