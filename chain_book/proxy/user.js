var models = require('../models');
var User = models.User;

/**
 * 根据登录ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} longinId 登录ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (loginId, callback) {
  User.findOne({loginId: loginId}, callback);
};

exports.newAndSave = function (newUser, callback) {
  var user         = new User();
  user.loginId     = newUser.loginId;
  user.nameId      = 'U' + newUser.loginId;
  user.passWord    = newUser.passWord;

  user.save(callback);
};