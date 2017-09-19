var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avatar: {type: String, default: "https://thesocietypages.org/socimages/files/2009/05/nopic_192.gif"},
    firstName: String,
    lastName: String,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);