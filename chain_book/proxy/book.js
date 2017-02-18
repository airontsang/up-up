var models = require('../models');
var Book = models.Book;
var async = require('async')

/**
 * 新增一个账本的基本信息
 * Callback:
 * - err, 数据库异常
 * - book, 账本对象
 * @param {Object} bookF 进来的账本对象
 * @param {Function} callback 回调函数
 */

exports.newAndSave = function (bookF, callback) {
    var book = new Book();
    book.founderId = bookF.founderId;
    book.title = bookF.title;
    book.place = bookF.place;
    book.intro = bookF.intro;
    book.picUrl = bookF.picUrl;

    book.save(callback)
}

/**
 * 根据账本Id修改账本基本信息
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本id
 * @param {Object} newBook 拥有新信息的账本对象
 * @param {Function} callback 回调函数
 */
exports.editBookById = function(id, newBook, callback) {
    var book = {};
    book.title = newBook.title;
    book.place = newBook.place;
    book.intro = newBook.intro;
    book.picUrl = newBook.picUrl;
    book.update_at = new Date();

    Book.findOneAndUpdate({_id: id},book,callback)
}

/**
 * 根据账本Id删除账本
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本id
 * @param {Function} callback 回调函数
 */
exports.delBookById = function(id, callback) {
    Book.findOneAndRemove({_id: id},callback)
}

/**
 * 根据账本Id获得账本
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本id
 * @param {Function} callback 回调函数
 */
exports.getBookById = function(id, callback) {
    Book.findOne({_id: id},callback)
}

/**
 * 根据账本ObjectId, page, pageSize查找账本
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {ObjectId} id 创建人id
 * @param {String} page 页码
 * @param {String} pageSize 每页大小  
 * @param {Function} callback 回调函数
 */
exports.queryBookByPage = function(founderId, page, pageSize, callback) {
    var start = (page - 1) * pageSize;
    var opt = { "_id": 0, "picUrl": 1, "intro": 1, "place": 1, "title": 1, "create_at": 1 } //没有标记的字段自动忽略，只有忽略_id时要标明
    var $page = {
        pageNumber: page
    };
    Book.find({ founderId: founderId }, opt).skip(start).limit(Number(pageSize)).sort({update_at: 'desc'}).exec(
        function (err, doc) {
            callback(err, doc)
        }
    )
}