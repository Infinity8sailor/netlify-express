'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const dbName = 'docs-io';
const url = '***REMOVED***test'; 


// FUNCTIONS



const router = express.Router();
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

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(logger('dev'));
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

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

module.exports = app;
module.exports.handler = serverless(app);
