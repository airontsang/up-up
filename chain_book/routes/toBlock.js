var express = require('express');
var router = express.Router();
var http = require('http');
router.get('/', function (req, res) {
    var opt = {
        method: "POST",
        host: "https://api.bubidev.cn",
        // port: 8080,
        path: "/oauth2/token?client_id=appId&client_secret=appKey&grant_type=client_credentials",
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
        }
    };
    var data = '';
    var req = http.request(opt, function (serverFeedback) {
        if (serverFeedback.statusCode == 200) {
            var body = "";
            serverFeedback.on('data', function (data) {
                    body += data;
                })
                .on('end', function () {
                    res.send(200, body);
                });
        } else {
            res.send(500, "error");
        }
    });
    req.write(data + "\n");
    req.end();
})

module.exports = router