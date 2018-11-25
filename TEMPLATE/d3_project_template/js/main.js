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
});

function updateVisualization() {
    var low = +document.getElementById('low').value;
    var high = +document.getElementById('high').value;

    var framedData = data.filter(function(d) {
        return (d.stars >= low && d.stars <=high);
    });

    console.log(framedData);

    testMap.displayData = framedData;
    testMap.updateVis();
    console.log(testMap.displayData);

}



