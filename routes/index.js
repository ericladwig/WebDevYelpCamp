var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var adminCode = process.env.ADMINCODE;
//ROUTE CONFIG
router.get("/",function(req,res) {
    res.render("landing");
});

//***AUTH ROUTES****
//Show register form
router.get("/register", function(req, res) {
    res.render("register",{page:"register"});
});
//handle user signup logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === adminCode) {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err,user) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req,res, function() {
                req.flash("success","Welcome to Yelp Camp " + user.username +"!");
                res.redirect("/campgrounds"); 
            });
        }
    });    
});
//Render login form
router.get("/login", function(req,res) {
   res.render("login",{page:"login"}); 
});
//Login Logic
router.post("/login",passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: "Invalid username and/or password"
}),  function(req,res) {
});

router.get("/logout", function(req,res) {
    req.logout();
    req.flash("success","Successfully Logged Out.");
    res.redirect("/campgrounds");
});


module.exports = router;