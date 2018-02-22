var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/todo");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error."));
db.on("open", function () {
    console.log("Mongodb connected");
});

module.exports = mongoose;
