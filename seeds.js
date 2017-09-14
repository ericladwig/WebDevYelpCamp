var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    data = [
        {
            name: "Sidewinder Gulch",
            image: "https://vignette.wikia.nocookie.net/reddeadredemption/images/d/d4/Rdr_sidewinder_gulch000.jpg/revision/latest/scale-to-width-down/1000?cb=20130730192120",
            description: "Southern plateaus of Mexico. Deep valleys meander through the area, making it difficult for navigation."
        },
        {
            name: "Odd Fellow's Rest",
            image: "https://vignette1.wikia.nocookie.net/reddeadredemption/images/0/0e/Rdr_odd_fellow%27s_rest_abstract.jpg/revision/latest/scale-to-width-down/1000?cb=20110427151340",
            description: "Area in Cholla Springs near infamous graveyard. Halfway between Ridgewood Farm and Armadillo"
        },
        {
            name: "Tanner's Reach",
            image: "https://vignette3.wikia.nocookie.net/reddeadredemption/images/4/44/Rdr_tanner%27s_reach.jpg/revision/latest/scale-to-width-down/1000?cb=20100630072734",
            description: "Small cabin in Tall Trees near the Aurora Basin.  Many safety hazards including, bears, elk, and blizzards."
        }
        ];


function seedDB() {
    //*********TEMPORARY, PLZ REMOVE NEXT 7 LINES
    //WITH FINISHED PRODUCT IF COLT DOESNT EXPLAIN
    Comment.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Removed all comments");
        }
    });
    //Remove all campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        //console.log("Removed campgrounds");
        data.forEach(function(seed) {
            Campground.create(seed, function(err,data) {
                if(err) {
                    console.log(err);
                } else {
                    //console.log("added a campground");
                    Comment.create({
                        text: "This place is great, but I wish there was WiFi.",
                        author: "John Marston"
                    }, function(err,comment) {
                        if(err) {
                            console.log(err);
                        } else {
                            data.comments.push(comment);
                            data.save();
                            //console.log("added comment");
                        }
                        
                    });
                }
            });
        });
    });
}

module.exports = seedDB;