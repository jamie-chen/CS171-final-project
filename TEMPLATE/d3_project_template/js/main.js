/* main JS file */

console.log("Hello JS world!");

var data = [];

var map = new InteractiveMap("map-area", data);


d3.json("data/LV_data.json", function(error, restaurantData) {
    if (error) throw error;
    restaurantData = restaurantData.slice(0, 100);

    var testMap = new RestaurantMap("test-map", restaurantData, [36.1699, -115.13398]);


});



