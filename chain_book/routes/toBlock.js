var express = require('express');
var Q = require('q');
var router = express.Router();
var request = require('request');
var crypto = require('crypto');
var async = require('async');
var BookItem = require('../proxy/bookItem');
var Book = require('../proxy/book');
var blockChain = require('../selfMiddleware/blockChain');
var jwtauth = require('../selfMiddleware/jwtauth');

router.post('/create', [jwtauth.authIsUser, jwtauth.authIsBookOwner, blockChain.BlockTokenMW], function (req, res, next) {
    function getBookString(callback) {
        Book.getallBookInfo(req.body.bookId, function (err, doc) {
            var sha1 = crypto.createHash('sha1');
            var opState = {}
            if (doc.bcHash) {
                opState.state = true
            } else {
                opState.state = false
            }
            opState.bookInfoHash = sha1.update(JSON.stringify(doc)).digest('hex');
            callback(null, opState)
        })
    };

    function getBookItemString(arg1, callback) {
        BookItem.getAllBookItemByBookId(req.body.bookId, function (err, doc) {
            var bookItemString = doc.join('');
            var sha1 = crypto.createHash('sha1');
            var allItemHash = sha1.update(bookItemString).digest('hex');
            var twoHash = arg1.bookInfoHash + allItemHash;
            var sha2 = crypto.createHash('sha1');
            arg1.toBlockHash = sha2.update(twoHash).digest('hex');
            callback(null, arg1)
        })
    };

    function hashToBlock(arg1, callback) {
        console.log("看类型" + arg1);
        //为真，则是修改
        if (arg1.state) {
            blockChain.refreshBlock(req.body.evidenceId, arg1.toBlockHash).then(function (result) {
                var evidenceObj = {}
                evidenceObj.dbHash = arg1.toBlockHash;
                evidenceObj.bc_hash = result.bc_hash;
                evidenceObj.evidence_id = req.body.evidenceId;
                callback(null, evidenceObj);
            }).fail(function (err) {
                res.json({
                    msg: err
                });
                return res;
            })
        } else {
            blockChain.createBlock(arg1.toBlockHash).then(function (result) {
                var evidenceObj = {}
                evidenceObj.dbHash = arg1;
                evidenceObj.bc_hash = result.bc_hash;
                evidenceObj.evidence_id = result.evidence_id;
                callback(null, evidenceObj);
            }).fail(function (err) {
                res.json({
                    msg: err
                });
                return res;
            })
        }
    };
    async.waterfall([
        getBookString,
        getBookItemString,
        hashToBlock,
    ], function (err, result) {
        if (!err) {
            Book.addEvidenceObj(req.body.bookId, result, function (err, query) {
                if (!err) {
                    console.log(query);
                    res.statusCode = 200;
                    res.json({
                        msg: '写入区块链成功'
                    });
                    return res;
                }
            });
        } else {
            res.json({
                error_code: 1018,
                msg: err
            })
        }
    })
})

router.get('/check', function (req, res) {
    function getBookString(callback) {
        Book.getallBookInfo(req.body.bookId, function (err, doc) {
            var sha1 = crypto.createHash('sha1');
            var bookInfoHash = sha1.update(JSON.stringify(doc)).digest('hex');
            callback(null, bookInfoHash)
        })
    };

    function getBookItemString(arg1, callback) {
        BookItem.getAllBookItemByBookId(req.body.bookId, function (err, doc) {
            var bookItemString = doc.join('');
            var sha1 = crypto.createHash('sha1');
            var allItemHash = sha1.update(bookItemString).digest('hex');
            var twoHash = arg1 + allItemHash;
            var sha2 = crypto.createHash('sha1');
            var toBlockHash = sha2.update(twoHash).digest('hex');
            callback(null, toBlockHash)
        })
    };

    async.waterfall([
        getBookString,
        getBookItemString,
    ], function (err, dbHash) {
        console.log("计算出的哈希" + dbHash);
        blockChain.checkBlock(req.query.bcHash).then(function (result) {
            var checkResult = {}
            checkResult.dbHash = dbHash;
            checkResult.bcMeta = result;
            res.json({
                error_code: 0,
                data: checkResult
            })
        }).fail(function (err) {
            res.json({
                msg: err
            });
            return res;
        })
    })
})
module.exports = router