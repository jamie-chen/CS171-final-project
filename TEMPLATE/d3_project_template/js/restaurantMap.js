var map;

var restaurant_imgs = [ "fast_food.jpeg", "american_food.jpeg", "italian.jpeg", "breakfast.jpeg",
    "mexican.jpeg", "chinese.jpeg", "japanese.jpeg", "american_new.jpeg", "diner.jpeg", "burgers.png"];

var restaurant_imgs_expanded = {
    "Fast Food": ["fast_food.jpeg", 'fast_food1.jpeg', "fast_food2.jpeg", "fast_food3.jpeg"],
    "American (Traditional)": ["american_food.jpeg", "american1.jpeg", "american2.jpeg", "american3.jpeg"],
    "Italian": ["italian.jpeg", "italian1.jpeg", "italian2.jpeg", "italian3.jpeg"] ,
    "Breakfast & Brunch": ["breakfast1.jpeg", "breakfast.jpeg", "waffles_default.jpeg", "breakfast2.jpeg"] ,
    "Mexican": ["mexican.jpeg", "mexican1.jpeg", "mexican2.jpeg", "mexican3.jpeg"],
    "Chinese" : ["chinese.jpeg", "chinese_default1.jpeg", "chinese_default2.jpeg", "chinese_default6.jpeg"],
    "Japanese": ["japanese.jpeg", "japanese1.jpeg", "japanese2.jpeg", "japanese3.jpeg"],
    "American (New)": ["american_food.jpeg", "american1.jpeg", "american2.jpeg", "american3.jpeg"],
    "Diners": ["diner.jpeg", "diner.jpeg1", "diner3.jpeg", "diner4.jpeg"],
    "Burgers": ["burgers.png", 'fast_food1.jpeg', "fast_food2.jpeg", "burgers2.jpeg"],
    "Restaurant": ["restaurant.jpeg", "american1.jpeg", "american2.jpeg", "american3.jpeg"],
};

/*
 * RestaurantMap - Object constructor function
 * @param _parentElement -- HTML element in which to draw the visualization
 * @param _data          -- Array with all restaurants of the region of interest
 * @param _mapPosition   -- Center of map
*/

RestaurantMap = function(_parentElement, _data, _mapPosition) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.mapPosition = _mapPosition;
    // $("#ex2").slider({});

    this.initVis();
};

/*
 * Initialize restaurant map
 */

RestaurantMap.prototype.initVis = function() {

    var vis = this;

    map = L.map(vis.parentElement, {
        minZoom: 11,
        maxZoom: 18
    }).setView([vis.mapPosition[0], vis.mapPosition[1]], 13);

    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 11,
        maxZoom: 18,
        ext: 'png'
    }).addTo(map);

    L.Icon.Default.imagePath = 'd3_project_template/images/';

    vis.wrangleData();
};

/*
 * Data wrangling
 */

RestaurantMap.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;

    vis.updateVis();
};

/*
 * Drawing function
 */
RestaurantMap.prototype.updateVis = function() {

    // function checkprice(n) {
    //     var result = '';
    //     for (var i = 0; i < n; i ++) {
    //         result += "$";
    //     }
    //     return result;
    // }

    var vis = this;

    if (vis.restaurants != null)
    {
        vis.restaurants.clearLayers();
    }

    vis.restaurants = L.featureGroup().addTo(map);

    var RestaurantIcon = L.Icon.extend({
        options: {
            shadowUrl: 'images/marker-shadow.png',
            iconSize: [25,30],
            iconAnchor: [12,30],
            popupAnchor: [0,-28],
            shadowAnchor: [12, 40],
        }
    });

    var topMarker = new RestaurantIcon({ iconUrl: 'images/marker-green.png'});
    var regMarker = new RestaurantIcon({ iconUrl: 'images/markers-coral.png'});

    var marker1 = new RestaurantIcon({ iconUrl: 'images/marker-1.png'});
    var marker2 = new RestaurantIcon({ iconUrl: 'images/marker-2.png'});
    var marker3 = new RestaurantIcon({ iconUrl: 'images/marker-3.png'});
    var marker4 = new RestaurantIcon({ iconUrl: 'images/marker-4.png'});
    var marker5 = new RestaurantIcon({ iconUrl: 'images/marker-5.png'});


    vis.displayData.forEach(function(d) {
        console.log(d);
        function filter_price(attr) {
            if (attr == null) {
                return '';
            }
            else return checkprice(attr.RestaurantsPriceRange2);
        };


        var popupContent = "<strong>" + d.name + "<br>" + filter_price(d.attributes) + "</strong><br>";
        popupContent += d.address;

        var rest, tempMarker;

        if (d.stars >= 4.0) {
            tempMarker = marker5;
        }
        else if (d.stars >= 3.0) {
            tempMarker = marker4;
        }
        else if (d.stars >= 2.0) {
            tempMarker = marker3;
        }
        else if (d.stars >= 1.0) {
            tempMarker = marker2;
        }
        else {
            tempMarker = marker1;
        }

        rest = L.marker([d.latitude, d.longitude], {icon: tempMarker, opacity: 0.7}).bindPopup(popupContent);
        vis.restaurants.addLayer(rest);

        // prep for clicking
        rest.name = d.name;
        rest.address = d.address;
        rest.state = d.state;
        rest.neighborhood = d.neighborhood;
        rest.business_id = d.business_id;
        rest.categories = d.categories;
        rest.city = d.city;
        rest.hours = d.hours;
        rest.stars = d.stars;
        rest.attributes = d.attributes;
        rest.review_count = d.review_count;


    });

    // click listener
    vis.restaurants.on("click", function(event) {
        var clickedMarker = event.layer;

        d3.select("div.restaurant-title").selectAll("*").remove();
        d3.select("div.star-rating").selectAll("*").remove();
        d3.select("div.price-label").selectAll("*").remove();

        // function checkstars(n) {
        //     console.log(n);
        //     var result = '';
        //     for (var i = 1; i <= n; i++) {
        //         result += "<span class='fas fa-star'></span>";
        //     }
        //     if (!(Number.isInteger(n))) {
        //         result += "<span class='fas fa-star-half'></span>";
        //     }
        //     return result;
        // }

        var stars = checkstars(clickedMarker.stars);


        var title = d3.select("div.restaurant-title").append("h1")
            .text(clickedMarker.name)
            .attr("class", "restaurant-title");

        var starlabel = d3.select("div.star-rating").append("g")
            .html(stars)
            .attr("class", "star-rating");

        // var checkdollars = function(n){
        //     var result = '';
        //     for (var i = 0; i < n; i ++ ) {
        //         result += "<span class='fas fa-dollar-sign'></span>";
        //     }
        //     return result;
        // };

        var dollars = checkdollars(clickedMarker.attributes.RestaurantsPriceRange2);
        var pricelabel = d3.select("div.price-label").append("g")
            .html(dollars)
            .attr("class", "price-label");

        var price = checkprice(clickedMarker.attributes.RestaurantsPriceRange2);

        var categories = ["Rating: ", "Price", "Number of Reviews: ", "Neighborhood: ", "Address: ", "Categories: "];
        var data = [clickedMarker.stars + "/5", price, clickedMarker.review_count, clickedMarker.neighborhood, clickedMarker.address + ", " + clickedMarker.city + " " + clickedMarker.state,
            clickedMarker.categories];

        var final_data = [];
        categories.forEach(function(d, index) {
            final_data[index] = d + data[index];
        });


        d3.select("div.col.restaurant-cat").selectAll("*").remove();
        d3.select("div.col.restaurant-cat").selectAll("p")
            .data(categories)
            .enter()
            .append("p")
            .attr("class", "restaurant-cat")
            .text(function(d) {return d});

        d3.select("div.col.restaurant-data").selectAll("*").remove();
        d3.select("div.col.restaurant-data").selectAll("p")
            .data(data)
            .enter()
            .append("p")
            .text(function(d) {
                if (d == '') {
                    return "Information unavailable";
                }
                else return d});
        //
        // console.log(clickedMarker);

        // var restaurant_imgs = [ "fast_food.jpeg", "american_food.jpeg", "italian.jpeg", "breakfast.jpeg",
        //     "mexican.jpeg", "chinese.jpeg", "japanese.jpeg", "american_new.jpeg", "diner.jpeg", "burgers.png"];

        var imgsource = find_image(clickedMarker.categories);
        if (imgsource != '') {
            var path = ["images/" + imgsource];
            console.log(path);
        };

        var img_width = $("#restaurant-images").width();

        d3.select("div.filler-image").selectAll("*").remove();
        var img_svg = d3.select("div.filler-image").append("svg")
            .attr("width", img_width)
            .attr("height", 250);

        img_svg.selectAll("image")
            .data(path)
            .enter()
            .append("image")
            .attr("xlink:href", path)
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", img_width)
            .attr("height", 300)
            .attr("class", "filler-image");


    });
};