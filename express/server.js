'use strict';
const express = require('express');
const mongoose = require('mongoose');
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
const dot = require('dotenv');
dot.config();

const routerAuth = require('./routes/auth');
const newTopicRouter = require('./routes/docs/newTopic');
const delTopicRouter = require('./routes/docs/delTopic');
const updateTopicRouter = require('./routes/docs/update');
const searchRouter = require('./routes/search/search');
const {google_auth, jwt_auth} = require('./routes/verifyToken');

const dbName = 'docs-io';
const url = '***REMOVED***test'; 
const url_doc = '***REMOVED***docs-io'; 
const router = express.Router();
mongoose.connect(url_doc,{ useUnifiedTopology: true }, ()=>console.log("connected to db"));

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger('dev'));
// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "https://docs-io.netlify.app/");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next()
// });
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/.netlify/functions/server', routerAuth);
app.use('/.netlify/functions/server/docs/newtopic', newTopicRouter);
app.use('/.netlify/functions/server/docs/del', delTopicRouter);
app.use('/.netlify/functions/server/docs/update', updateTopicRouter);
app.use('/.netlify/functions/server/search', searchRouter);

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!!!!!!!!</h1>');
  res.end();
});
router.get('/test',jwt_auth, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>tesing is going on...!!!!!!!!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

router.post("/guest/topics/", function (req, res) {
  console.log("from gest topics",req.body);
  //   res.sendFile('public/topics/'+req.body.fileName+'.json',{ root: __dirname+ '/..' });+
  if (req.body.fileName[0] == undefined) {
    res.send("Eroor"); 
  }
  else { 
    MongoClient.connect(url, function(err, client) {
      if (!err) {
        // Get db
        const db = client.db(dbName);
        // Get collection
        const collection = db.collection('topics');
        // Find all documents in the collection
        collection.find({"_id":ObjectId(req.body.fileName[0])}).toArray(function(err, todos) {
          if (!err) {
            // send output back
            res.send(todos[0]);
            // console.log(todos[0]);
          }
        });
        // close db client
        client.close();
      }
    });
  }
    // update_data(req.body);
  });

router.post("/docs/topics/", jwt_auth, function (req, res) {
  console.log("res/req",req.body);
  //   res.sendFile('public/topics/'+req.body.fileName+'.json',{ root: __dirname+ '/..' });
  MongoClient.connect(url, function(err, client) {
    if (!err) {
      // Get db
      const db = client.db(dbName);
      // Get collection
      const collection = db.collection('topics');
      // Find all documents in the collection
        collection.find({"_id":ObjectId(req.body.fileName[0])}).toArray(function(err, todos) {
          if (!err) {
            // send output back
            res.send(todos[0]);
            console.log(todos[0]);
          }
        });
        // close db client
        client.close();
      }
    });
    // update_data(req.body);
  });
router.post("/guest/topicList", (req,res)=> {
  console.log("Guest topicList");
  // MongoClient.connect(url, function(err, client) {
  //   if (!err) {
  //     // Get db
  //     const db = client.db(dbName);
  //     // Get collection
  //     const collection = db.collection('topics');
  //     // Find all documents in the collection
  //     collection.find({"info":"Topics"}).toArray(function(err, todos) {
  //         if (!err) {
  //           // send output back
  //           res.send(todos[0].topics);
  //           console.log(todos[0].topics);
  //         }
  //       });
  //       // close db client
  //       client.close();
  //     }
  //   });
  MongoClient.connect(url, function(err, client) {
    if (!err) {
      // Get db
      const db = client.db(dbName);
      // Get collection
      const collection = db.collection('users');
      // Find all documents in the collection
      collection.find({"email":"vinfinitysailor@gmail.com"}).toArray(function(err, todos) {
          if (!err) {
            // send output back
            if (todos[0] == undefined) return res.status(500).send("doesnt exist");
            res.send(todos[0].topics);
            console.log(todos[0].topics);
          }
        });
        // close db client
        client.close();
      }
    });
});

router.post("/docs/topicList/", jwt_auth, function (req, res) {
    console.log("res/req",req.body);
    //   res.sendFile('public/topics/'+req.body.fileName+'.json',{ root: __dirname+ '/..' });
    MongoClient.connect(url, function(err, client) {
      if (!err) {
        // Get db
        const db = client.db(dbName);
        // Get collection
        const collection = db.collection('users');
        // Find all documents in the collection
        collection.find({"email":req.body.user}).toArray(function(err, todos) {
            if (!err) {
              // send output back
              if (todos[0] == undefined) return res.status(500).send("doesnt exist");
              res.send(todos[0].topics);
              console.log(todos[0].topics);
            }
          });
          // close db client
          client.close();
        }
      });
      // update_data(req.body);
    });

  // FUNCTIONS
    module.exports = app;
    module.exports.handler = serverless(app);
    