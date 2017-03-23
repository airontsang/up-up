var express = require('express');
var router = express.Router();
var request = require('request');
var crypto = require('crypto');
var BookItem = require('../proxy/bookItem');
var Book = require('../proxy/book');
var blockChain = require('../selfMiddleware/blockChain');
var jwtauth = require('../selfMiddleware/jwtauth');

router.get('/create', [jwtauth.authIsUser, jwtauth.authIsBookOwner], function (req, res) {
    if (typeof global.blockToken === "undefined") {
        blockChain.getBlockToken();
    } else {
        var bookId = req.query.bookId;
        BookItem.getAllBookItemByBookId(bookId, function (error, allBookObj) {
            if (!err) {
                var allBookString = allBookObj.join("");
                var sha1 = crypto.createHash('sha1');
                var toBlockHash = sha1.update(req.query.passWord).digest('hex');
                console.log("toBlockHash为 " + toBlockHash)
                    // var backEvidenceId = blockChain.createBlock(toBlockHash)
                if (backEvidenceId) {
                    Book.addEvidenceId(backEvidenceId);
                    res.statusCode = 200;
                    res.json({
                        msg: '写入区块链成功'
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