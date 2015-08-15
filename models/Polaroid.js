var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    twid: String
    , author: String
    , avatar: String
    , body: String
    , date: Date
    , screenname: String
});

schema.statics.reset = function(callback){
    Polaroid.remove({},function(err){
        console.log('Polaroid: Dropping collection');
        callback(err);
    });
};

schema.statics.recent = function (limit, callback) {

    if (!limit || limit == 0){
        limit = 20;
    }
    var tweets = [];

    Polaroid.find({}, 'twid screenname avatar body date')
        .sort({date: 'desc'}).limit(limit).exec(function (err, docs) {

            if (!err) {
                tweets = docs;
            }
            callback(tweets);
        });
};

module.exports = Polaroid = mongoose.model('Polaroid', schema);
