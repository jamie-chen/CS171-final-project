/* main JS file */


var data = [];
var testMap;
var lastCategory = undefined;

d3.json("data/LV_data.json", function(error, restaurantData) {
    if (error) throw error;

    // Remove data in which categories list is empty
    // restaurantData = restaurantData.filter(function(d) {
    //     console.log(d);
    //     return !d.categories;
    // });

    restaurantData = restaurantData.filter(function(d) {
        // console.log(d.categories);
        // console.log(d);
        if (!d.categories) {
            return false;
        }
        var temp_categories = d.categories;
        return temp_categories.includes("Restaurants");
    });
    // console.log("Num restaurants:");
    // console.log(restaurantData.length);
    restaurantData = restaurantData.slice(0, 500);
    restaurantData = restaurantData.filter(function(d) {
        console.log(d);
        return d.hasOwnProperty("categories");
    });

    data = restaurantData;

    var recommended_rest = '';

    // To generate our own suggested restaurant
    d3.select("#generatorRestaurant").on("click", function() {
        recommended_rest = createWebsiteGenRestaurant();
    });

    testMap = new RestaurantMap("test-map", data, [36.1699, -115.13398]);
    treeMap = new TreeMap("#tree-map-div", data);


    // restaurantRec = new GenRecommendation("#restaurant-recommendation", data);


    d3.select("#ratingFilter").on("click", function() {
        updateVisualization();
    });

    // d3.select("#priceFilter").on("click", function() {
    //     console.log("clicked");
    //     updateVisualization();
    // })
});

function generateRec(rest_name) {

    // if not selected, then default. otherwise update with generated name
    d3.select(".reviews").selectAll("*").remove();
    var rec_restaurant = find_rest(rest_name);
    console.log(rec_restaurant);
    console.log(data);

    // title
    d3.select("div.title").selectAll("*").remove();
    d3.select("div.rest-name").selectAll("*").remove();
    d3.select("div.price-label1").selectAll("*").remove();
    d3.select(".star-label1").selectAll("*").remove();

    var title = d3.select("div.title").selectAll("h2")
        .data(rec_restaurant)
        .enter()
        .append("h2")
        .text(function(d) {
            console.log("TEST");
            if (d.name == "Teriyaki Brother") {
                return "Trending Now";
            }
            else return "Based on your search, we recommend: "
        })
        .attr("class", "title");

    var rest_name = d3.select("div.rest-name").selectAll("h1")
        .data(rec_restaurant)
        .enter()
        .append("h1")
        .text(function(d) {return d.name})
        .attr("class", "rest-name");

    var imgsource = find_image2(rec_restaurant[0].categories);

    var img_width = $("#default-img").width();

    for (var i = 0; i < 4; i ++ ) {
        console.log(imgsource);
        var path = ["images/" + imgsource[i]];
        var selector = "#rec-image-" + (i + 1);
        d3.select(selector).selectAll("*").remove();
        var img_svg = d3.select(selector).append("svg")
            .attr("width", 300)
            .attr("height", 300);

        img_svg.selectAll("image")
            .data(path)
            .enter()
            .append("image")
            .attr("xlink:href", path)
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", 300)
            .attr("height", 300)
            .attr("class", "rec-image");

    };
    // var img_svg = d3.select("div.rec-image").append("svg")
    //     .attr("width", img_width)
    //     .attr("height", 300);
    //
    // img_svg.selectAll("image")
    //     .data(path)
    //     .enter()
    //     .append("image")
    //     .attr("xlink:href", path)
    //     .attr("x", "0")
    //     .attr("y", "0")
    //     .attr("width", img_width)
    //     .attr("height", 300)
    //     .attr("class", "rec-image");

    var stars = checkstars(rec_restaurant[0].stars);
    var dollars = checkdollars(rec_restaurant[0].attributes.RestaurantsPriceRange2);
    console.log(rec_restaurant[0].attributes.RestaurantsPriceRange2);
    var price = checkprice(rec_restaurant[0].attributes.RestaurantsPriceRange2);


    var pricelabel = d3.select("div.price-label1").append("g")
        .html(dollars)
        .attr("class", "price-label1");

    var starlabel = d3.select("div.star-label1").append("g")
        .html(stars)
        .attr("class", "star-rating1");

    var categories = ["Rating: ", "Price", "Number of Reviews: ", "Neighborhood: ", "Address: ", "Categories: "];
    var rest_data = [rec_restaurant[0].stars + "/5", price, rec_restaurant[0].review_count, rec_restaurant[0].neighborhood, rec_restaurant[0].address + ", " + rec_restaurant[0].city + " " + rec_restaurant[0].state,
        rec_restaurant[0].categories];

    d3.select("div.col.restaurant-cat1").selectAll("*").remove();
    d3.select("div.col.restaurant-cat1").selectAll("p")
        .data(categories)
        .enter()
        .append("p")
        .attr("class", "restaurant-cat1")
        .text(function(d) {return d});

    d3.select("div.col.restaurant-data1").selectAll("*").remove();
    d3.select("div.col.restaurant-data1").selectAll("p")
        .data(rest_data)
        .enter()
        .append("p")
        .text(function(d) {
            if (d == '') {
                return "Information unavailable";
            }
            else return d});


    function find_rest(rest_name) {
        var result = {};
        if (rest_name == '') {
            result = data.filter(function(e) {
                return e.name == "Teriyaki Brother";
            })
        }
        else result = data.filter(function(e) {
            return e.name == rest_name;
        });
        if (result.length > 1) {
            result = [result[0]];
        }
        return result;
    }


}

function createWebsiteGenRestaurant() {
    var category = document.getElementById('restCategory').value;
    var price = +document.getElementById('priceCategory').value;
    var stars = +document.getElementById('minRating').value;

    var selectCategory = data.filter(function(d) {
        return (d.categories != null && d.categories.includes(category));
    });

    var priceFit = selectCategory.filter(function(d) {
        return (selectCategory != null && d.attributes != null && d.attributes.RestaurantsPriceRange2 != null
            && +d.attributes.RestaurantsPriceRange2 === price);
    });

    var starFit = priceFit.filter(function(d) {
        return (priceFit != null && d.stars >= stars);
    });

    console.log(starFit);

    if (starFit.length == 0) {
        d3.select('#restaurant-rec').text("Sorry we don't have a restaurant that fits your criteria!");
        return '';
    }
    else {
        d3.select('#restaurant-rec').text("Try out this restaurant: " + starFit[0].name);
        generateRec(starFit[0].name);
        return starFit[0].name;
    }
}

function updateVisualization(category) {
    var filteredData = data;
    console.log(lastCategory);
    console.log("category is");
    if (category != undefined) {
        console.log("aasdfy");
        lastCategory = category;
        filteredData = filteredData.filter(function(d) {
            return (d.categories.includes(category));
        });
    }
    else if (lastCategory != undefined) {
        filteredData = filteredData.filter(function(d) {
            return (d.categories.includes(lastCategory));
        });
    }


    var low = +document.getElementById('low').value;
    var high = +document.getElementById('high').value;

    var lowPrice = +document.getElementById('lowPrice').value;
    var highPrice = +document.getElementById('highPrice').value;
    console.log(lowPrice);
    console.log("low price is");
    filteredData = filteredData.filter(function(d) {
        return (d.stars >= low && d.stars <=high);
    });

    var attributesExist = filteredData.filter(function(d) {
        return (d.attributes != null && d.attributes.RestaurantsPriceRange2 != null);
    });
    var display = attributesExist.filter(function(d) {
        return (+d.attributes.RestaurantsPriceRange2 >= lowPrice && +d.attributes.RestaurantsPriceRange2 <= highPrice);
    });
    console.log(display);

    treeMap.updateVis(display);
    testMap.displayData = display;
    testMap.updateVis();
}

function updateVisualizationByCategory(category) {
    lastCategory = category;
    var filteredData = data.filter(function(d) {
        return (d.categories.includes(category));
    });

    var display = filteredData.filter(function(d) {
        return (d.attributes != null && d.attributes.RestaurantsPriceRange2 != null);
    });

    treeMap.updateVis(display);
    testMap.displayData = display;
    testMap.updateVis();
}

function resetTreeMap() {
    lastCategory = undefined;
    updateVisualization();
    d3.select("#selected-cat")
        .text("Selected Category: All Categories");

}


function checkprice(n) {
    var result = '';
    for (var i = 0; i < n; i ++) {
        result += "$";
    }
    return result;
}

var checkdollars = function(n){
    var result = '';
    for (var i = 0; i < n; i ++ ) {
        result += "<span class='fas fa-dollar-sign'></span>";
    }
    return result;
};

function checkstars(n) {
    console.log(n);
    var result = '';
    for (var i = 1; i <= n; i++) {
        result += "<span class='fas fa-star'></span>";
    }
    if (!(Number.isInteger(n))) {
        result += "<span class='fas fa-star-half'></span>";
    }
    return result;
}

function find_image(lst) {
    console.log(lst);
    var result ='';
    restaurant_categories.forEach(function(type, index) {
        if (lst.includes(type)) {
            result = restaurant_imgs[index];
        }
    });
    if (result =='') {
        result = "restaurant.jpeg";
    }
    return result;
};

function find_image2(lst) {
    console.log(lst);
    var result ='';
    restaurant_categories.forEach(function(type, index) {
        if (lst.includes(type)) {
            result = restaurant_imgs_expanded[type];
        }
    });
    if (result =='') {
        result = restaurant_imgs_expanded["Restaurant"];
    }
    return result;
};


