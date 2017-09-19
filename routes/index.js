var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");
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
    var newUser = new User({username: req.body.username, firstName: req.body.firstName, lastName:req.body.lastName,
        email:req.body.email, avatar:req.body.avatar
    });
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

//USER PROFILES
router.get("/users/:id", function(req,res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            req.flash("error",err.message);
            res.redirect("/");
        } else {
            Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds) {
                if(err) {
                    req.flash("error",err.message);
                    res.redirect("/");
                } else {
                    res.render("users/show", {user:foundUser, campgrounds:campgrounds});
                }
            });
        }
    });
});
//EDIT ROUTE
router.get("/users/:id/edit", middleware.isLoggedIn, middleware.checkUser, function(req,res) {
   User.findById(req.params.id, function(err,user) {
        res.render("users/edit", {user:user});       
   });
});
//UPDATE ROUTE
router.put("/users/:id",middleware.checkUser, function(req,res) {
    var newData = {username: req.body.user.username, firstName: req.body.user.firstName, lastName: req.body.user.lastName,
        email: req.body.user.email, avatar: req.body.user.avatar};
    User.findByIdAndUpdate(req.params.id,{$set: newData}, function(err,foundUser) {
       if(err) {
           req.flash("error",err.message);
           res.redirect("/campgrounds");
       } else {
           req.flash("success","Profile Updated!");
           res.redirect("/users/" + req.params.id);
       }
    });
});


module.exports = router;