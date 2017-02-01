var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, {
    server: {
        poolSize: 20
    }
}, function (err) {
    if (err) {
        console.log('connect to %s error: ', config.db);
        console.log(err);
        process.exit(1);
    }
})

//models
require('./user')

exports.User = mongoose.model('User')