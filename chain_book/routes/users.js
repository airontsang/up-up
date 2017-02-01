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
      res.statusCode = 401;
      res.json({
        msg: '后台错误'
      });
      return res;
    } else if (!user || user.passWord != passWord) {
      res.statusCode = 401;
      res.json({
        msg: '用户名或密码错误'
      });
      return res;
    } else {
      var expires = moment().add('days', 1).valueOf();
      var token = jwt.encode({
        iss: user.loginId,
        exp: expires
      }, 'MY_SCRECT_KEY')
      res.json({
        msg: '登录成功!',
        token: token
      })
    }
  })
});

router.post('/reg*', function (req, res, next) {
  var newUser = {};
  newUser.loginId = req.query.loginId;
  var md5 = crypto.createHash('md5');
  newUser.passWord = md5.update(req.query.passWord).digest('hex');

  User.getUserById(req.query.loginId, function (err, user) {
    if (err) {
      res.statusCode = 401;
      res.json({
        msg: '后台错误'
      });
      return res;
    } else if (user) {
      res.statusCode = 401;
      res.json({
        msg: '用户已存在，请重新注册'
      });
      return res;
    } else {
      User.newAndSave(newUser, function (err, user) {
        if (err) {
          res.statusCode = 401;
          res.json({
            msg: '后台错误'
          });
          return res;
        } else {
          res.json({
            msg: '注册成功！'
          });
        }
      })
    }
  })
});

module.exports = router;