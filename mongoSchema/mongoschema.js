const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, require: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "img.png"},
    phone:{type: String },
    dob: {type: String, trim: true},
    gender: {type: String, trim: true},
    details: {type: String, trim: true,  default: "No detail"}
},{timestamps: true});

var User = mongoose.model('User', UserSchema);
module.exports = User;
//schema