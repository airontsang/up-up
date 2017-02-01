var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
    founderId: { type: ObjectId },
    title: { type: String },
    place: { type: String },
    intro: { type: String },
    picUrl: { type: String },
    update_at: { type: Date, default: Date.now }
})
BookSchema.pre('save', function(next){
    var now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('Book', BookSchema);