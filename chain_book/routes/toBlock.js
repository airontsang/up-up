var express = require('express');
var router = express.Router();
var request = require('request');
var crypto = require('crypto');
var BookItem = require('../proxy/bookItem');
var blockChain = require('../selfMiddleware/blockChain');
router.get('/', function (req, res) {

})

router.get('/create', function (req, res) {
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
                    // blockChain.createBlock(toBlockHash)
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
module.exports = router


