var mongoose = require('mongoose');
var config = require('../config');

mongoose.Promise = global.Promise;  //使用nodejs的Promise
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
require('./book')
require('./bookItem')

exports.User = mongoose.model('User')
exports.Book = mongoose.model('Book')
exports.BookItem = mongoose.model('BookItem')
