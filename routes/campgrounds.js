var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require("geocoder");
var apikey = process.env.APIKEY;


router.get("/",function(req,res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds,page:"campgrounds"});      
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req,res) {
   res.render("campgrounds/new"); 
});

router.post("/", middleware.isLoggedIn, function(req,res) {
   //get data from form
   var name = req.body.name;
   var image = req.body.image;
   var description = req.sanitize(req.body.description);
   var price = req.body.price;
   var author = {
        id: req.user._id,
        username: req.user.username
   };
   geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
   //add to campgrounds DB
       Campground.create({name:name,image:image,description:description,author:author,price:price,location:location,lat:lat,lng:lng}, 
       function(err,newlyCreated) {
           if(err) {
               req.flash("err",err.message);
           } else {
               req.flash("success","Campground Added!");
               //redirect to campgrounds page
               res.redirect("/campgrounds");
           }
       });
   });
});

//You to have /new before /:id, otherwise it'd be categorized as :id
router.get("/:id", function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) {
        if(err || !foundCampground) {
            req.flash("Campground does not exist.");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show",{campground: foundCampground,apikey:apikey});
        }
    });
});
//EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground) {
        res.render("campgrounds/edit",{campground: foundCampground}); 
    });
});
//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res) {
    req.body.campground.description = req.sanitize(req.body.campground.description);
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id,{$set: newData},function(err,updatedCampground) {
            if(err) {
                req.flash("error", err.message);
                res.redirect("/campgrounds");
            }   else  {
                req.flash("success","Campground updated!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        }); 
    });
});
//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req,res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;