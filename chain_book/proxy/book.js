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
    book.title = bookF.title;
    book.founderId = bookF.founderId;
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
    var book = new Book();
    book.title = newBook.title;
    // book.founderId = bookF.founderId;
    book.intro = newBook.intro;
    book.picUrl = newBook.picUrl;

    book.findOneAndUpdate({_id: id},book,callback)
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
