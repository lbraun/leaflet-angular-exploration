var db = require("./connection");

var task = db.model('mytasks', {
    title: {type: String, required: true},
    dueDate: {type: String, required: true},
    address: {type: String, required: true},
    lat: {type: Number, required:true },
    lng: {type:Number, required:true}
});

module.exports = task;
