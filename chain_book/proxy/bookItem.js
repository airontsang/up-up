var models = require('../models');
var BookItem = models.BookItem;
var async = require('async')

/**
 * 新增一个账本的基本信息
 * Callback:
 * - err, 数据库异常
 * - bookItem, 账本细则对象
 * @param {Object} bookItemF 进来的账本细则对象
 * @param {Function} callback 回调函数
 */

exports.newAndSave = function (bookItemF, callback) {
    var bookItem = new BookItem();
    bookItem.bookId = bookItemF.bookId;
    bookItem.content = bookItemF.content;
    bookItem.charge = bookItemF.charge;

    bookItem.save(callback)
}

/**
 * 根据账本细则Id修改账本基本信息
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本细则id
 * @param {Object} newBookItem 拥有新信息的账本细则对象
 * @param {Function} callback 回调函数
 */
exports.editBookItemBybookId = function(id, newBookItem, callback) {
    var bookItem = {};
    bookItem.content = newBookItem.content;
    bookItem.charge = newBookItem.charge;
    bookItem.update_at = new Date();

    BookItem.findOneAndUpdate({_id: id},bookItem,callback)
}

/**
 * 根据账本细则Id删除账本
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本细则id
 * @param {Function} callback 回调函数
 */
exports.delBookItemBybookId = function(id, callback) {
    BookItem.findOneAndRemove({_id: id},callback)
}

/**
 * 根据账本细则Id获得一条账本细则
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本细则id
 * @param {Function} callback 回调函数
 */
exports.getBookItemById = function(id, callback) {
    BookItem.findOne({_id: id},callback)
}

/**
 * 根据某账本ObjectId, page, pageSize查找属于该账本的全部细则
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {ObjectId} bookId 某账本id
 * @param {String} page 页码
 * @param {String} pageSize 每页大小  
 * @param {Function} callback 回调函数
 */
exports.querySomeBookItemByBook = function(bookId, page, pageSize, callback) {
    var start = (page - 1) * pageSize;
    var opt = { "_id": 1, "charge": 1, "content": 1, "update_at": 1 } //没有标记的字段自动忽略，只有忽略_id时要标明
    
    BookItem.find({ bookId: bookId }, opt).skip(start).limit(Number(pageSize)).sort({update_at: 'desc'}).exec(
        function (err, doc) {
            callback(err, doc)
        }
    )
}