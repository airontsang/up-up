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
    var tradeNo = Math.random().toString(36).substr(2,9);
    var formData = {
        trade_no: tradeNo,
        signers: [{
            bubi_address: "bubiV8hzUjae4kvhKdmrX8zNzNxVDogprpuw1Jmh",
            password: "123456",
        }],
        metadata: dataHash
    }
    var opt = {
        url: "https://api.bubidev.cn/evidence/v2/create?access_token=" + global.blockToken,
        method: "POST",
        json: formData
    };
    var defer = Q.defer();
    var reg_back = request(opt, function (error, response, body) {
        // var res = JSON.parse(response.body);
        console.log(response.body)
        if (!error && response.body.err_code === "0") {
            console.log('OK');
            console.log(response.body.data.evidence_id);
            var bubiRes = {}
            bubiRes.evidence_id = response.body.data.evidence_id;
            bubiRes.bc_hash = response.body.data.bc_hash;
            defer.resolve(bubiRes);
        } else if (response.body.data.err_code !== "0") {
            console.log("没有操作")
            console.log(response.body)
            defer.reject(response.body);
        } else {
            console.log("网络错误")
            console.log(error)
            defer.reject(error);
        }
    })
    return defer.promise;
}

var refreshBlock = function (evidenceId, dataHash) {
    var tradeNo = Math.random().toString(36).substr(2,9);
    var formData = {
        trade_no: tradeNo,
        evidence_id: evidenceId,
        signers: [{
            bubi_address: "bubiV8hzUjae4kvhKdmrX8zNzNxVDogprpuw1Jmh",
            password: "123456",
        }],
        metadata: dataHash
    }
    var opt = {
        url: "https://api.bubidev.cn/evidence/v2/modify?access_token=" + global.blockToken,
        method: "POST",
        json: formData
    };
    var defer = Q.defer();
    var reg_back = request(opt, function (error, response, body) {
        // var res = JSON.parse(response.body);
        console.log(response.body)
        if (!error && response.body.err_code === "0") {
            console.log('OK');
            console.log(response.body.data.evidence_id);
            var bubiRes = {}
            bubiRes.bc_hash = response.body.data.bc_hash;
            defer.resolve(bubiRes);
        } else if (response.body.data.err_code !== "0") {
            console.log("没有操作")
            console.log(response.body)
            defer.reject(response.body);
        } else {
            console.log("网络错误")
            console.log(error)
            defer.reject(error);
        }
    })
    return defer.promise;
}

var checkBlock = function (bcHash) {
    var bubi_address = "bubiV8hzUjae4kvhKdmrX8zNzNxVDogprpuw1Jmh"
    var opt = {
        url: "https://api.bubidev.cn/evidence/v1/history?bubi_address=" + bubi_address + "&access_token=" + global.blockToken,
        method: "GET",
    };
    var defer = Q.defer();
    var reg_back = request(opt, function (error, response, body) {
        console.log(response.body)
        if (!error && response.body.err_code === "0") {
            console.log(response.body.data);
            var bubiData = response.body.data;
            var targetMeta = "";
            bubiData.forEach( function (item) {
                if(item.hash == bcHash){
                    targetMeta = item.metadata
                }
            })
            defer.resolve(targetMeta);
        } else if (response.body.data.err_code !== "0") {
            console.log("没有操作")
            console.log(response.body)
            defer.reject(response.body);
        } else {
            console.log("网络错误")
            console.log(error)
            defer.reject(error);
        }
    })
    return defer.promise;
}


exports.getBlockToken = getBlockToken;
exports.createBlock = createBlock;
exports.BlockTokenMW = BlockTokenMW;
