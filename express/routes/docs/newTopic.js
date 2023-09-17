const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

const {newTopic} = require('../../modal/schemes');
const {google_auth, jwt_auth} = require('../verifyToken');

const dbName = 'docs-io';
const url = process.env.Mongo + "test";

router.post("/",jwt_auth, (req, res) => {
    // console.log("res/req",res,req.body);
    var __id; 
    MongoClient.connect(url, async (err, client) => {
      if (!err) {
        // Get db
        const db = client.db(dbName);
        // Get collection
        const collection_topics = db.collection('topics');
        const collection_users = db.collection('users');
        // Find all documents in the collection
        // var empty_topic_data = empty_topic;
        // empty_topic_data.name = req.body.new_topic[0].toUpperCase()+ req.body.new_topic.slice(1);
        if (true){
                const newTopicScheme = new newTopic({
                    name:req.body.new_topic[0].toUpperCase()+ req.body.new_topic.slice(1),
                });
                console.log("Id From topic Created 1 : ",newTopicScheme);
                const __id = await newTopicScheme.save(); 
                  console.log("Id From topic Created 2 : ",__id);
                  collection_users.updateOne(
                    // { "_id": ObjectId("608a66766f081e23647d21cd") },
                    { "email":req.body.user },
                  {
                      $push: {
                          topics: {
                          $each: [[__id._id, __id.name]],
                          $position: -1
                      }
                  }
                  }, function(err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        console.log("Updated the document with the field a equal to 2",);
                        res.header({Status: "Success"});
                        res.send("Success");
                      });
        };
          // close db client
          client.close();
        }
      });
    });

    module.exports = router;