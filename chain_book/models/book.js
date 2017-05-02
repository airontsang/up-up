var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BookSchema = new Schema({
    founderId: { type: ObjectId },
    title: { type: String },
    place: { type: String },
    intro: { type: String },
    picUrl: { type: String },
    partyTime: { type: Date },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: false },
    sum: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
    dbHash: { type: String, default: ""},
    bcHash: { type: String, default: ""},    
    evidenceId: { type: String, default: "" }
})
BookSchema.pre('save', function(next){
    var now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('Book', BookSchema);