var request = require('request');
var uuid = require('node-uuid');
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
            console.log("Token为 " + global.blockToken)
        } else {
            console.log("错误")
            console.log(error)
        }
    })
}

var createBlock = function (evidenceId, dataHash) {
    var formData = {
            access_token: global.blockToken,
            trade_no: uuid.v1(),
            signers: [{
                "bubi_address": "bubiV8hzUjae4kvhKdmrX8zNzNxVDogprpuw1Jmh",
                "password": "132456",
            }],
            metadata: dataHash
        }
        var opt = {
            url: "https://api.bubidev.cn/evidence/v2/create",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: formData
        };

        var reg_back = request(opt, function (error, response, body) {
            if (response.statusCode == 200) {
                console.log('OK');
                return response.body.evidence_id;
            } else {
                console.log("错误")
                console.log(error)
                return false;
            }
        })
}

var refreshBlock = function (dataHash) {
    var formData = {
            access_token: global.blockToken,
            trade_no: uuid.v1(),
            evidence_id:evidenceId,
            signers: [{
                "bubi_address": "bubiV8hzUjae4kvhKdmrX8zNzNxVDogprpuw1Jmh",
                "password": "132456",
            }],
            metadata: dataHash
        }
        var opt = {
            url: "https://api.bubidev.cn/evidence/v2/modify",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: formData
        };

        var reg_back = request(opt, function (error, response, body) {
            if (response.statusCode == 200) {
                console.log('OK');
                return true;
            } else {
                console.log("错误")
                console.log(error)
                return false;
            }
        })
}

exports.getBlockToken = getBlockToken;
exports.createBlock   = createBlock;
exports.refreshBlock   = refreshBlock;
