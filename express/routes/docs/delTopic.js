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
          const collection_topics = db.collection('topics');
          const collection_users = db.collection('users');
          // Find all documents in the collectio  
          var topic = req.body.topic_info;
  
          collection_topics.deleteOne({ _id : ObjectId(topic[0])}, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Removed the document with the field a equal to 3");
            // callback(result);
          });
          
          collection_users.updateOne(
            { "email":req.body.user },
          {
              $pull: {
                  topics: [ObjectId(topic[0]), topic[1]]
          }
      }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            res.send("Success");
          });
            // close db client
            client.close();
          }
        });
    
    });

    module.exports = router;