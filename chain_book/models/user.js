var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    loginId: {type: String},
    passWord: {type: String},
    nameId: {type: String},
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
})
UserSchema.pre('save', function(next){
    var now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('User', UserSchema);