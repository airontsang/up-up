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

router.post('/create', function (req, res) {
    if (typeof global.blockToken === "undefined") {
        // blockChain.getBlockToken();
        console.log("拿Token")
    }
    function getBookString (callback) {
        Book.getallBookInfo(req.body.bookId, function (err, doc) {
            callback(null, JSON.stringify(doc))
        })
    };
    function getBookItemString (arg1, callback) {
        BookItem.getAllBookItemByBookId(req.body.bookId, function (err, doc) {
            var bookItemString = arg1 + doc.join('');
            var sha1 = crypto.createHash('sha1');
            var allItemHash = sha1.update(bookItemString).digest('hex');
            console.log("toBlockHash为 " + allItemHash);
            callback(null, allItemHash)
        })
    };
    function hashToBlock (arg1, callback) {
        console.log("这里是hash" + arg1);
    };
    async.waterfall([
        getBookString,
        getBookItemString,
        hashToBlock,
    ], function (err, result) {
        console.log("这里是结果" + result)
    }) 

        


    //写入操作
    // if (backEvidenceId) {
    //     Book.addEvidenceId(backEvidenceId);
    //     res.statusCode = 200;
    //     res.json({
    //         msg: '写入区块链成功'
    //     });
    //     return res;
    // }
})

router.get('/refresh', [jwtauth.authIsUser, jwtauth.authIsBookOwner, jwtauth.authIsBookItem], function (req, res) {
    if (typeof global.blockToken === "undefined") {
        blockChain.getBlockToken();
    } else {
        var modifiedBookItem = {};
        modifiedBookItem.bookId = req.query.bookId;
        modifiedBookItem.content = req.query.content;
        modifiedBookItem.charge = req.query.charge;

        BookItem.editBookItemBybookId(req.query.bookItemId, modifiedBookItem, function (err, query) {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: '后台错误'
                });
                return res;
            } else {
                BookItem.getAllBookItemByBookId(req.query.bookId, function (error, allBookObj) {
                    if (!err) {
                        var allBookString = allBookObj.join("");
                        var sha1 = crypto.createHash('sha1');
                        var toBlockHash = sha1.update(req.query.passWord).digest('hex');
                        console.log("toBlockHash为 " + toBlockHash)
                        var backStatus = blockChain.refreshBlock(req.query.evidenceId, toBlockHash)
                        if (backStatus) {
                            res.statusCode = 200;
                            res.json({
                                msg: '修改区块链数据成功'
                            });
                            return res;
                        }
                    } else {
                        console.log(err)
                        res.statusCode = 401;
                        res.json({
                            msg: '获取账目失败'
                        });
                        return res;
                    }
                });
            }
        })
    }
})
module.exports = router