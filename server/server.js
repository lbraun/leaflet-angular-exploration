var express = require('express');
var app = express();
var port = 3000;
var cors = require('cors')
var task = require("./task");
app.use(cors());


//express
var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post("/todo", function(req, res, next) {
  task.create({
    title: req.body.title,
    dueDate: req.body.dueDate,
    address: req.body.address,
    lat: req.body.lat,
    lng: req.body.lng
  }, function(err, task) {
    if (err) {
      res.status(500);
      next(err);
    } else {
      res.status(201);
      res.send(task);
    }
  });
})
app.delete("/todo/:id", function(req, res, next) {
  var id = req.params.id;
  task.remove({
    _id: id
  }, function(err, result) {
    if (err) {
      res.status(500);
      next("Internal server error.");
    } else if (result.n == 0) {
      res.status(404); // Not found
      next("Not found.");
    } else {
      res.status(200);
      res.send(result);
    }
  });
})
app.put("/todo/:id", function(req, res, next) {
  var id = req.params.id;
  task.update({
    _id: id
  }, {
    title: req.body.title,
    dueDate: req.body.dueDate,
    address: req.body.address,
    lat: req.body.lat,
    lng: req.body.lng
  }, function(err, result) {
    if (err) {
      res.status(500);
      next("Internal server error.");
    } else if (result.n == 0) {
      res.status(404); // Not found
      next("Not found.");
    } else {
      res.status(200);
      res.send(result);
    }
  });
})
app.get("/todo", function(req, res) {
  var stream = task.find().stream();
  if (stream) {
    var results = [];
    stream.on('data', function(doc) {
      delete doc.__v;
      results.push(doc);
    }).on("error", function(err) {
      res.status(500);
      next(err);
    }).on('close', function() {
      res.status(200);
      res.send(results);
    });
  } else {
    res.status(500);
    res.send("Error");
  }
})

var server = app.listen(port, function() {
  console.log('Server running at http://127.0.0.1:' + port);
});
