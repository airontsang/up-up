var express = require('express');
var router = express.Router();
var User = require('../proxy/user');
var crypto = require('crypto');
var jwt = require('jwt-simple');
var moment = require('moment');

router.get('/Login*', function (req, res, next) {
  var loginId = req.query.loginId;
  var md5 = crypto.createHash('md5');
  var passWord = md5.update(req.query.passWord).digest('hex');

  User.getUserById(loginId, function (err, user) {
    if (err) {
      res.json({
        error_code: 1001,
        msg: '数据库操作错误'
      });
      return res;
    } else {
      if (!user) {
      res.json({
        error_code: 1002,
        msg: '用户不存在'
      });
      return res;
    } else if (user.passWord != passWord){
      res.json({
        error_code: 1003,
        msg: '用户名或密码错误'
      });
      return res;
    } else {
      var expires = moment().add(1, 'days').valueOf();
      var token = jwt.encode({
        iss: user.loginId,
        exp: expires
      }, 'MY_SECRET_STRING')
      res.json({
        error_code: 0,
        msg: '登录成功!',
        token: token
      })
    }
    }
  })
});

router.post('/reg*', function (req, res, next) {
  var newUser = {};
  newUser.loginId = req.body.loginId;
  var md5 = crypto.createHash('md5');
  newUser.passWord = md5.update(req.body.passWord).digest('hex');

  User.getUserById(req.body.loginId, function (err, user) {
    if (err) {
      res.json({
        error_code: 1001,
        msg: '数据库操作错误'
      });
      return res;
    } else if (user) {
      res.json({
        error_code: 1004,
        msg: '用户已存在'
      });
      return res;
    } else {
      User.newAndSave(newUser, function (err, user) {
        if (err) {
          res.json({
            error_code: 1001,
            msg: '数据库操作错误'
          });
          return res;
        } else {
          res.json({
            error_code: 0,
            msg: '注册成功！'
          });
        }
      })
    }
  })
});

module.exports = router;