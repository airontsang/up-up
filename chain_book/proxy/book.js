var models = require('../models');
var Book = models.Book;
var Q = require('q');
var async = require('async');

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
    book.partyTime = bookF.partyTime;
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
    book.partyTime = newBook.partyTime;
    book.picUrl = newBook.picUrl;
    book.update_at = new Date();

    // ,place: newBook.place, update_at: new Date()
    // Book.findOneAndUpdate({_id: id},book,callback)
    Book.update({_id: id}, {$set: book }).exec(
        function(err, result){
            callback(err, result)
        })
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
 * 根据账本Id写入总收入，总支出，余额
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {String} id 账本id
 * @param {Function} callback 回调函数
 */
exports.writeMoney = function(id, money, cb) {
    var sheet = {}
    sheet.sum       = money.sum
    sheet.balance   = money.balance
    sheet.spend     = money.spend
    Book.update({_id: id}, {$set: {sum:money.sum,balance:money.balance,spend:money.spend, update_at: new Date()}}).exec(
        function(err, result){
            cb(err, result)
        })
}

exports.getallBookInfo = function(id, callback) {
    var opt = { "_id": 1, "title": 1, "place": 1, "intro": 1, "picUrl": 1, "partyTime":1 , "create_at": 1, "sum": 1, "spend": 1, "balance": 1 }     
    Book.findOne({_id: id}, opt).exec(
        function(err, bookInfo){
            callback(err, bookInfo)
        })
}


/**
 * 根据账本founderId, page, pageSize查找属于该用户的全部账本
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {ObjectId} founderId 创建人id
 * @param {String} page 页码
 * @param {String} pageSize 每页大小  
 * @param {Function} callback 回调函数
 */
exports.queryBookByFounder = function(founderId, page, pageSize, callback) {
    var start = (page - 1) * pageSize;
    var opt = { "_id": 1, "picUrl": 1, "intro": 1, "place": 1, "title": 1, "partyTime":1 , "create_at": 1, "isPublic": 1, "sum": 1, "spend": 1, "balance": 1 } //没有标记的字段自动忽略，只有忽略_id时要标明    
    var $page = {
        pageNumber: page
    };
    Book.find({ founderId: founderId }, opt).skip(start).limit(Number(pageSize)).sort({update_at: 'desc'}).exec(
        function (err, doc) {
            callback(err, doc)
        }
    )
}

/**
 * 根据账本founderId查找属于该用户的最近编辑的第一个账本
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {ObjectId} founderId 创建人id
 * @param {Function} callback 回调函数
 */
exports.queryLatestBook = function(founderId, callback) {
    var opt = { "_id": 1, "picUrl": 1, "intro": 1, "place": 1, "title": 1, "partyTime":1 , "create_at": 1, "isPublic": 1, "sum": 1, "spend": 1, "balance": 1 } //没有标记的字段自动忽略，只有忽略_id时要标明
    Book.find({ founderId: founderId }, opt).sort({update_at: 'desc'}).exec(
        function (err, doc) {
            console.log(doc)
            callback(err, doc[0])
        }
    )
}

/**
 * 根据账本ObjectId,添加账本evidenceObj三项内容
 * Callback:
 * - err, 数据库异常
 * - Query, 结果对象
 * @param {ObjectId} id 创建人id
 * @param {String} page 页码
 * @param {String} pageSize 每页大小  
 * @param {Function} callback 回调函数
 */
exports.addEvidenceObj = function(Id, evidenceObj, callback) {

    Book.update({ _id: Id }, {$set: { dbHash: evidenceObj.dbHash, bcHash: evidenceObj.bc_hash, evidenceId:evidenceObj.evidence_id, isPublic:true }}).exec(
        function (err, doc) {
            callback(err, doc)
        }
    )

    
}