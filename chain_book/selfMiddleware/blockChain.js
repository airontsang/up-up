var request = require('request');
var uuid = require('node-uuid');
var Q = require('q');
var getBlockToken = function () {
    var formData = {
        client_id: '104a08bbbdc84703ba54fa26fcc6cdeb',
        client_secret: 'c242531f1b3228d979b220828d708a17',
        grant_type: 'client_credentials'
    }
    var opt = {
        url: "https://api.bubidev.cn/oauth2/token",
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: formData
    };
    var req_block = request(opt, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var res_body = JSON.parse(body);
            global.blockToken = res_body.access_token;
            console.log("Token为 " + global.blockToken);
        } else {
            console.log("错误");
            console.log(error);
        }
    })
}

var BlockTokenMW = function (req, res, next) {
    if (!global.blockToken) {
        var formData = {
            client_id: '104a08bbbdc84703ba54fa26fcc6cdeb',
            client_secret: 'c242531f1b3228d979b220828d708a17',
            grant_type: 'client_credentials'
        }
        var opt = {
            url: "https://api.bubidev.cn/oauth2/token",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: formData
        };
        var req_block = request(opt, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var res_body = JSON.parse(body);
                global.blockToken = res_body.access_token;
                // console.log("Token为 " + global.blockToken);
                next();
            } else {
                console.log("错误");
                console.log(error);
                res.statusCode = 401
                res.json('获取区块链token错误')
                return res
            }
        })
    } else {
        next()
    }
}

var createBlock = function (dataHash) {
    console.log("拿到了token " + global.blockToken);
    var formData = {
        trade_no: '1000009820181283525798',
        signers: [{
            bubi_address: "bubiV8hzUjae4kvhKdmrX8zNzNxVDogprpuw1Jmh",
            password: "132456",
        }],
        metadata: dataHash
    }
    var opt = {
        url: "https://api.bubidev.cn/evidence/v2/create?access_token=" + global.blockToken,
        method: "POST",
        form: formData
    };
    var defer = Q.defer();
    var reg_back = request(opt, function (error, response, body) {
        var res = JSON.parse(response.body);
        if (!error && typeof res.err_code === 0) {
            console.log('OK');
            console.log(response.body.evidence_id);
            var bubiRes = {}
            bubiRes.evidence_id = response.body.evidence_id;
            bubiRes.bc_hash = response.body.bc_hash;
            defer.resolve(bubiRes);
        } else if (res.err_code !== 0) {
            console.log("没有操作")
            console.log(res)
            defer.reject(res);
        } else {
            console.log("发生错误")
            console.log(res.msg)
            defer.reject(res.msg);
        }
    })
    return defer.promise;
}


var testBlock = function () {
    console.log("这");
    console.log("拿到了token " + global.blockToken);
    var formData = {
        "metadata": "895654",
        "signers": [
            {
                "bubi_address": "bubiV8hzUjae4kvhKdmrX8zNzNxVDogprpuw1Jmh",
                "password": "123456"
            }
        ],
        "trade_no": "8546542we"
    }
    var opt = {
        url: "https://api.bubidev.cn/evidence/v2/create?access_token=" + global.blockToken,
        method: "POST",
        headers: {
            'Content-Type': 'text/html;charset=UTF8',
        },
        form: formData,
    };
    var defer = Q.defer();
    var reg_back = request(opt, function (error, response, body) {
        var res = JSON.parse(response.body);
        if (!error && typeof res.err_code === 0) {
            console.log('OK');
            console.log(res);
            defer.resolve(res);
        } else if (res.err_code !== 0) {
            console.log("没有操作")
            console.log(res)
            defer.reject(res);
        } else {
            console.log("发生错误")
            console.log(res.msg)
            defer.reject(res.msg);
        }
    })
    return defer.promise;
}

var registerBlock = function () {
    console.log("拿到了token " + global.blockToken);
    console.log("uuid" + uuid.v1())
    var formData = {
        user_name: "tsangzeng85",
        password: "qew898",
        trade_no: "26dsdgfg56egdfg",
        metadata: "test"
    }
    var opt = {
        url: "https://api.bubidev.cn/account/v1/register?access_token=" + global.blockToken,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        form: formData
    };
    var defer = Q.defer();
    var reg_back = request(opt, function (error, response, body) {
        var res = JSON.parse(response.body);
        if (!error && typeof res.err_code === 0) {
            console.log('OK');
            defer.resolve(res);
        } else if (res.err_code !== 0) {
            console.log("没有操作")
            console.log(res)
            defer.reject(res);
        } else {
            console.log("发生错误")
            console.log(res.msg)
            defer.reject(res.msg);
        }
    })
    return defer.promise;

}

exports.getBlockToken = getBlockToken;
exports.createBlock = createBlock;
exports.BlockTokenMW = BlockTokenMW;
exports.testBlock = testBlock;
exports.registerBlock = registerBlock;

