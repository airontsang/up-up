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

// router.post('/create', blockChain.BlockTokenMW, function (req, res, next) {
//     function getBookString(callback) {
//         Book.getallBookInfo(req.body.bookId, function (err, doc) {
//             var sha1 = crypto.createHash('sha1');
//             var bookInfoHash = sha1.update(JSON.stringify(doc)).digest('hex');
//             callback(null, bookInfoHash)
//         })
//     };

//     function getBookItemString(arg1, callback) {
//         BookItem.getAllBookItemByBookId(req.body.bookId, function (err, doc) {
//             var bookItemString = doc.join('');
//             var sha1 = crypto.createHash('sha1');
//             var allItemHash = sha1.update(bookItemString).digest('hex');
//             var twoHash = arg1 + allItemHash;
//             var sha2 = crypto.createHash('sha1');
//             var toBlockHash = sha2.update(twoHash).digest('hex');
//             callback(null, toBlockHash)
//         })
//     };

//     function hashToBlock(arg1, callback) {
//         blockChain.createBlock(arg1).then(function (result) {
//             console.log("返回的res" + result);
//             callback(null, result);
//         }).fail(function (err) {
//             res.statusCode = 401;
//             res.json({
//                 msg: err
//             });
//             return res;
//         })
//     };
//     async.waterfall([
//         getBookString,
//         getBookItemString,
//         hashToBlock,
//     ], function (err, result) {
//         if (!err) {
//             Book.addEvidenceId(req.body.bookId, result, function (err, query) {
//                 if (!err) {
//                     console.log(query);
//                     res.statusCode = 200;
//                     res.json({
//                         msg: '写入区块链成功'
//                     });
//                     return res;
//                 }
//             });
//         } else {
//             res.statusCode = 401;
//             res.json({
//                 error_code: 1000,
//                 msg: err
//             })
//         }
//     })
// })

router.post('/create', function (req, res) {
    if (typeof global.blockToken === "undefined") {
        blockChain.getBlockToken();
    } else {
        blockChain.testBlock().then(function (result) {
            res.json({
                data: result
            })
        }).fail(function (err) {
            res.statusCode = 401;
            res.json({
                msg: err
            });
            return res;
        })
    }       
})
module.exports = router