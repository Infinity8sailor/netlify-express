var express = require('express');
// var { update_data , add_new_topic } = require('../data/data');
var fs = require('fs');
const path = require('path');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbName = 'docs-io';
const url = process.env.Mongo + "test";


// const data = require('./../data/public/World.json');
// const path = "./data/public/World.json";

var data = (path) => {
  let file = fs.readFileSync(path);
  let _file = JSON.stringify(file);
  return _file;
};

function update_data(data){
  var topic = data.name
  fs.writeFile('./public/topics/'+topic+'.json',JSON.stringify(data),err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Successfully wrote file')
      }
  });
}

function add_new_topic(data,topics){
  var topic = data[0].toUpperCase()+ data.slice(1);
  // console.log("Capitalized here",topic);
  const empty_data = {"name":topic,"color":"red","cells":[
      {
          "cell_layout":{"cell_type":"Markdown","code_lan":"markdown"},
          "source":"Add Edit Content Here....!"
      }
  ]}
  fs.writeFile('./public/topics/'+topic+'.json',JSON.stringify(empty_data),err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Successfully wrote file')
      }
  });
  topics.topics.push(topic);
  fs.writeFile('./public/topics/Topics.json',JSON.stringify(topics),err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Successfully wrote file')
      }
  });
}

function add_new_image(img,metadata){
  var name = new Date.now();
  // console.log("Capitalized here",topic);
  const empty_data = {"name":topic,"color":"red","cells":[
      {
          "cell_layout":{"cell_type":"Img","code_lan":"markdown"},
          "source":"Add Edit Content Here....!"
      }
  ]}
  fs.writeFile('./public/topics'+topic+'.json',JSON.stringify(empty_data),err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Successfully wrote file')
      }
  });
  topics.topics.push(topic);
  fs.writeFile('./public/topics/Topics.json',JSON.stringify(topics),err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Successfully wrote file')
      }
  });
}

/* GET home page. */
router.get('/', function (req, res) {
  res.header("Content-Type",'application/json');
//   res.sendFile('public/topics/Topics.json',{ root: __dirname+ '/..' });

MongoClient.connect(url, function(err, client) {
    if (!err) {

      // Get db
      const db = client.db(dbName);

      // Get collection
      const collection = db.collection('topics');

      // Find all documents in the collection
      collection.find({"info":"Topics"}).toArray(function(err, todos) {
        if (!err) {

          // write HTML output

          // send output back
          res.send(todos[0]);

          // log data to the console as well
          console.log(todos[0]);
        }
      });

      // close db client
      client.close();
    }
  });
    // MongoClient.connect(url, function(err, client) {
    //     if (!err) {
    
    //       // Get db
    //       const db = client.db(dbName);
    
    //       // Get collection
    //       const collection = db.collection('topics');
    
    //       // Find all documents in the collection
    //       collection.find({}).toArray(function(err, todos) {
    //         if (!err) {
    
    //           // write HTML output
    //           var output = '<html><header><title>Todo List from DB</title></header><body>';
    //           output += '<h1>TODO List retrieved from DB</h1>';
    //           output += '<table border="1"><tr><td><b>' + 'Description' + '</b></td><td><b>' + 'Details' + '</b></td></tr>';
    
    //           // process todo list
    //           todos.forEach(function(todo){
    //             output += '<tr><td>' + todo.description + '</td><td>' + todo.details + '</td></tr>';
    //           });
    
    //           // write HTML output (ending)
    //           output += '</table></body></html>'
            
    
    //           // send output back
    //           res.send(output);
    
    //           // log data to the console as well
    //           console.log(todos);
    //         }
    //       });
    
    //       // close db client
    //       client.close();
    //     }
    //   });
});


router.post("/topics/", function (req, res) {
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

router.post("/images/", function (req, res) {
  console.log("res/req",res,req.body);
  res.sendFile('public/images/'+req.body.fileName,{ root: __dirname+ '/..' });
  // update_data(req.body);
});

router.post("/newtopic/", function (req, res) {
  console.log("res/req",req.body);
  var Topics_list = require('../public/topics/Topics.json');
  //res.sendFile('data/public/'+req.body.fileName+'.json',{ root: __dirname+ '/..' });
  add_new_topic(req.body.new_topic,Topics_list);
});

router.post("/update/", function (req, res) {
  // res.header("Content-Type",'application/json');
  // res.send("data recieved");
  console.log(req.body);
  update_data(req.body);
});
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Docs' });
//   });
  
module.exports = router;
