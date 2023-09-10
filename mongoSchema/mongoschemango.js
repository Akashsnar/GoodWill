const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const conn=require("./database");
const ngoSchema= new Schema({
    username:String,
    name: String,
    image: String,
    desc: String
  })
  
  //model
  var ngomodel=mongoose.model('ngophotos', ngoSchema);
  module.exports=ngomodel;
  