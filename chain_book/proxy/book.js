var models = require('../models');
var Book = models.Book;

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
 * 根据账本Id更新账本信息
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本id
 * @param {Object} id 存有新信息的账本对象
 * @param {Function} callback 回调函数
 */
// exports.editBookById = function(id, modifiedBook, callback) {
//     // Book.findOne({_id: id}, function (err, book) {
//     //     if (err) {
//     //         return callback(err || !book)
//     //     }
//     //     book = modifiedBook;
//     //     book.save(callback);
//     // })
//     Book.findOneAndUpdate({_id: id}, modifiedBook, callback);
// }