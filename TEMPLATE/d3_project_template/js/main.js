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
    })

    data = restaurantData;

    // To generate our own suggested restaurant
    d3.select("#generatorRestaurant").on("click", function() {
        createWebsiteGenRestaurant();
    });

    testMap = new RestaurantMap("test-map", data, [36.1699, -115.13398]);
    treeMap = new TreeMap("#tree-map-div", data);


    d3.select("#ratingFilter").on("click", function() {
        updateVisualization();
    });

    // d3.select("#priceFilter").on("click", function() {
    //     console.log("clicked");
    //     updateVisualization();
    // })
});

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
    }
    else {
        d3.select('#restaurant-rec').text("Try out this restaurant: " + starFit[0].name);
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
