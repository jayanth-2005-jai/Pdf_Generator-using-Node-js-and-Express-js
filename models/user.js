const mongoose = require('mongoose');
const userschema = mongoose.Schema({
     name:{type:String, required:true},
     course:{type:String, required:true},
     date:{type:Date, default:Date.now}
});
module.exports = mongoose.model('User', userschema);