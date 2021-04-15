'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const dbName = 'docs-io';
const url = '***REMOVED***test'; 
const router = express.Router();

const empty_topic = {
    "name":"empty_topic",
    "color":"red",
    "cells":[{
        "cell_layout":{
            "cell_type":"Markdown",
            "code_lan":"markdown"
          },
        "source":"Add Edit Content Here....!"
      }]
    };

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(logger('dev'));
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!!!!!!!!</h1>');
  res.end();
});
router.get('/test', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>tesing is going on...!!!!!!!!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

router.post("/docs/topics/", function (req, res) {
  console.log("res/req",res,req.body);
  //   res.sendFile('public/topics/'+req.body.fileName+'.json',{ root: __dirname+ '/..' });
  MongoClient.connect(url, function(err, client) {
    if (!err) {
      // Get db
      const db = client.db(dbName);
      // Get collection
      const collection = db.collection('topics');
      // Find all documents in the collection
      if (req.body.fileName == "Topics"){
        collection.find({"info":"Topics"}).toArray(function(err, todos) {
          if (!err) {
            // send output back
            res.send(todos[0]);
            console.log(todos[0]);
          }
        });
      }
      else {
        collection.find({"name":req.body.fileName}).toArray(function(err, todos) {
          if (!err) {
            // send output back
            res.send(todos[0]);
            console.log(todos[0]);
          }
        })};
        // close db client
        client.close();
      }
    });
    // update_data(req.body);
  });
  
  router.post("/docs/newtopic/", function (req, res) {
    console.log("res/req",res,req.body);
    //   res.sendFile('public/topics/'+req.body.fileName+'.json',{ root: __dirname+ '/..' });
    MongoClient.connect(url, function(err, client) {
      if (!err) {
        // Get db
        const db = client.db(dbName);
        // Get collection
        const collection = db.collection('topics');
        // Find all documents in the collection
        var empty_topic_data = empty_topic;
        empty_topic_data.name = req.body.new_topic[0].toUpperCase()+ req.body.new_topic.slice(1);
        if (true){
            collection.insertMany([empty_topic_data], function(err, result) {
                  assert.equal(err, null); 
                  assert.equal(1, result.result.n);
                  assert.equal(1, result.ops.length);
                  console.log("Inserted 1 document into the collection");
            });
            collection.updateOne(
              { "_id": ObjectId("604bedb9e824210dec7d12f2") },
            {
                $push: {
                    topics: {
                    $each: [empty_topic_data.name],
                    $position: -1
                }
            }
        }, function(err, result) {
              assert.equal(err, null);
              assert.equal(1, result.result.n);
              console.log("Updated the document with the field a equal to 2");
              callback(result);
            });
        };
          // close db client
          client.close();
        }
      });
      // update_data(req.body);
    });

    router.post("/docs/update/", function (req, res) {
      console.log("res/req",res,req.body);
      //   res.sendFile('public/topics/'+req.body.fileName+'.json',{ root: __dirname+ '/..' });
      MongoClient.connect(url, function(err, client) {
        if (!err) {
          // Get db
          const db = client.db(dbName);
          // Get collection
          const collection = db.collection('topics');
          // Find all documents in the collection

          var topic = req.body;
          if (true){
              // collection.insertMany([empty_topic_data], function(err, result) {
              //       assert.equal(err, null); 
              //       assert.equal(1, result.result.n);
              //       assert.equal(1, result.ops.length);
              //       console.log("Inserted 1 document into the collection");
              // });
              var topic_id = topic._id;
              delete topic["_id"];
              collection.updateOne(
                { "_id": ObjectId(topic_id)}, { $set: topic },
                function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("Updated the document with the field a equal to 2");
                callback(result);
              });
          };
            // close db client
            client.close();
          }
        });
        // update_data(req.body);
      });

  // FUNCTIONS
  
    module.exports = app;
    module.exports.handler = serverless(app);
    