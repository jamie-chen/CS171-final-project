var map;

/*
 * GenRecommendation - Object constructor function
 * @param _parentElement -- HTML element in which to draw the visualization
 * @param _data          -- Array with all restaurants of the region of interest
 * @param _mapPosition   -- Center of map
*/

GenRecommendation = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
};

/*
 * Initialize visualization
 */

GenRecommendation.prototype.initVis = function() {

    var vis = this;

    vis.wrangleData();
};


GenRecommendation.prototype.wrangleData = function() {
    var vis = this;

    vis.displayData = vis.data;

    vis.updateVis();
};

RestaurantMap.prototype.updateVis = function() {
    var vis = this;


}
