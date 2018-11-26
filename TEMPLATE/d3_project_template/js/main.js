/* main JS file */

console.log("Hello JS world!");

var data = [];
var testMap;

d3.json("data/LV_data.json", function(error, restaurantData) {
    if (error) throw error;
    restaurantData = restaurantData.slice(0, 500);

    data = restaurantData;

    testMap = new RestaurantMap("test-map", data, [36.1699, -115.13398]);

    d3.select("#ratingFilter").on("click", function() {
       updateVisualization();
    });

    d3.select("#priceFilter").on("click", function() {
        updateVisualization();
    })
});

function updateVisualization() {
    var low = +document.getElementById('low').value;
    var high = +document.getElementById('high').value;

    var lowPrice = determinePrice('lowPrice');
    console.log(lowPrice);
    var highPrice = determinePrice('highPrice');
    console.log(highPrice);

    var filteredData = data.filter(function(d) {
        return (d.stars >= low && d.stars <=high);
    });

    var attributesExist = filteredData.filter(function(d) {
        return (d.attributes != null && d.attributes.RestaurantsPriceRange2 != null);
    });

    var display = attributesExist.filter(function(d) {
        return (+d.attributes.RestaurantsPriceRange2 >= lowPrice && +d.attributes.RestaurantsPriceRange2 <= highPrice);
    });

    console.log(display);

    testMap.displayData = display;
    testMap.updateVis();
    console.log(testMap.displayData);

}

function determinePrice(element) {
    var symbol = document.getElementById(element).value;

    if (symbol === '$') {
        return 1;
    }
    else if (symbol === '$$') {
        return 2;
    }
    else if (symbol === '$$$') {
        return 3;
    }
    else {
        return 4;
    }
}



