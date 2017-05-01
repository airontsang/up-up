var models = require('../models');
var BookItem = models.BookItem;
var async = require('async');
var Q = require('q');

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
    bookItem.type = bookItemF.type;
    bookItem.tag = bookItemF.tag;
    bookItem.happen_at = bookItemF.happen_at;
    
    bookItem.save(callback)
}

/**
 * 操作前用，返回操作前的账本细则
 * Callback:
 * - err, 数据库异常
 * - bookItem, 账本细则对象
 * @param {Object} bookItemF 进来的账本细则对象
 * @param {Function} callback 回调函数
 */

exports.getItem = function (itemId, callback) {
    bookItem.findOne({_id: itemId}).exec(
        function(err, doc) {
            callback(err, doc)
        }
    )
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
    bookItem.type = newBookItem.type;
    bookItem.tag = newBookItem.tag;
    bookItem.happen_at = newBookItem.happen_at;    
    bookItem.update_at = new Date();

    // BookItem.findOneAndUpdate({_id: id},bookItem,callback)

    BookItem.update({_id: id}, {$set: bookItem }).exec(
        function(err, result){
            callback(err, result)
        })
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
 * 根据账本Id删除关于该账本的全部账目
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} bookId 账本id
 * @param {Function} callback 回调函数
 */
exports.delAllBookItem = function(bookId, callback) {
    BookItem.remove({bookId: bookId},callback)
}

/**
 * 根据账本细则Id获得全部账本细则，便于计算
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本细则id
 * @param {Function} callback 回调函数
 */
exports.allBookItemById = function(bookId, callback) {
    var opt = { "charge": 1, "type":1, }
    BookItem.find({bookId: bookId},callback)
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
    var opt = { "_id": 1, "charge": 1, "content": 1, "type":1, "tag":1, "happen_at": 1 } //没有标记的字段自动忽略，只有忽略_id时要标明
    
    BookItem.find({ bookId: bookId }, opt).skip(start).limit(Number(pageSize)).sort({update_at: 'desc'}).exec(
        function (err, doc) {
            callback(err, doc)
        }
    )
}

/**
 * 根据某账本ObjectId查找属于该账本的全部细则
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {ObjectId} bookId 某账本id 
 * @param {Function} callback 回调函数
 */
exports.getAllBookItemByBookId = function(bookId, callback) {
    BookItem.find({ bookId: bookId }).sort({update_at: 'desc'}).exec(
        function (err, doc) {
            callback(err, doc)
        })
}