var express = require('express');
var router = express.Router();
var Book = require('../proxy/book');
var jwtauth = require('../selfMiddleware/jwtauth');

router.post('/addInfo*', jwtauth, function (req, res, next) {
    console.log(res.locals.user)
});

module.exports = router;