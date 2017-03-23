var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BookSchema = new Schema({
    founderId: { type: ObjectId },
    title: { type: String },
    place: { type: String },
    intro: { type: String },
    picUrl: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    isPublic: { type: Boolean },
    evidenceId: { type: String }
})
BookSchema.pre('save', function(next){
    var now = new Date();
    this.update_at = now;
    this.evidenceId = '';
    next();
});

mongoose.model('Book', BookSchema);