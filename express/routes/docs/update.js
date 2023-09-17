const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

const {google_auth, jwt_auth} = require('../verifyToken');

const dbName = 'docs-io';
const url = process.env.Mongo + "test";

router.post("/",jwt_auth, (req, res) => {
    MongoClient.connect(url, function(err, client) {
        if (!err) {
          // Get db
          const db = client.db(dbName);
          // Get collection
          const collection = db.collection('topics');
          // Find all documents in the collection

          var topic = req.body.updated_info;
          if (true){
              var topic_id = topic._id;
              delete topic["_id"];
              collection.updateOne(
                { "_id": ObjectId(topic_id)}, { $set: topic },
                function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("Updated the document with the field a equal to 2");
                // callback(result);
              });
          };
            // close db client
            client.close();
          }
        });    
});

module.exports = router;