var MongoClient = require('mongodb').MongoClient;

var state = {
    db: null
}

exports.connect = function(url, cb) {
    if(state.db) return cb();

    MongoClient.connect(url, function(err,db) {
        if(err) {
            return cb(err);
        };

        console.log("Connected successfully");
        state.db = db;
        cb();
    });
}

exports.get = function() {
    return state.db;
}

exports.open = function(collection) {
    return new Promise((resolve, reject) => {
        collection.find().toArray( function(err, docs) {
                resolve(docs.length? docs[0]: {"error": "[me] doc undefined"});
        });  
    });   
}


exports.update = function(collection, value) {
    collection.updateOne({}, value , { upsert:true }, function(err, result) {
        if(err) console.log("An error occured: " + err);
        else console.log("Updated!");
    });
}

exports.close = function(cb) {
    if(state.db) {
        state.db.close(function(err, result) {
            state.db = null;
            done(err);
        })
    }
}
