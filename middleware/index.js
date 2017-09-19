var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err,foundCampground) {
            if(err || !foundCampground) {
                req.flash("error","Campground not found.");
                res.redirect("/campgrounds");
            } else {
                //If user is logged in, did user create the campground
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();  
                } else {
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","Please login first!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req,res,next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err,foundComment) {
            if(err || !foundComment) {
                req.flash("error","Comment not found.");
                res.redirect("/campgrounds");
            } else {
                //If user is logged in, did user create the comment
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();  
                } else {
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","Please login first!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error","Please login first!");
    res.redirect("/login");
};

middlewareObj.checkUser = function(req,res,next) {
  if(req.isAuthenticated()) {
      User.findById(req.params.id, function(err, foundUser) {
          if(err || !foundUser) {
              req.flash("error","User not found.");
              res.redirect("/campgrounds");
          } else {
              if(foundUser._id.equals(req.user._id) || req.user.isAdmin) {
                  next();
              } else {
                  req.flash("error","You don't have permission to do that.");
                  res.redirect("/campgrounds");
              }
          }
      });
  }  
};


module.exports = middlewareObj;