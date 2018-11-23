var map;
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

    this.initVis();
};

/*
 * Initialize restaurant map
 */

RestaurantMap.prototype.initVis = function() {

    var vis = this;

    map = L.map(vis.parentElement).setView([vis.mapPosition[0], vis.mapPosition[1]], 13);

    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    }).addTo(map);

    vis.wrangleData();
};

/*
 * Data wrangling
 */

RestaurantMap.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis();
};

/*
 * Drawing function
 */
RestaurantMap.prototype.updateVis = function() {
    var vis = this;

    restaurants = L.layerGroup().addTo(map);

    vis.data.forEach(function(d) {
        var popupContent = "<strong>" + d.name + "</strong> <br>";
        popupContent += d.address;

        var rest = L.marker([d.latitude, d.longitude]).bindPopup(popupContent);

        restaurants.addLayer(rest);
    })

};