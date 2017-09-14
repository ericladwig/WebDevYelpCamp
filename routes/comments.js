var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//=====================================
//======Nested Comment Routes==========
//=====================================
router.get("/new", middleware.isLoggedIn, function(req,res) {
    Campground.findById(req.params.id,function(err,campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function(err,campground) {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error","Something went wrong.");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment Added!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});
//EDIT ROUTE
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req,res) {
    Comment.findById(req.params.comment_id, function(err,foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});    
        }
    });
});
//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment) {
        if(err) {
            req.flash("error",err.message);
            res.redirect("back");
        }   else  {
            req.flash("success","Comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    }); 
});
//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;
