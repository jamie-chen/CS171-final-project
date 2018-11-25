/*
 * InteractiveMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- the actual data: perDayData
 */
InteractiveMap = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    console.log("hello");
    this.initVis();
};

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */
InteractiveMap.prototype.initVis = function() {
    var vis = this;

    vis.svg = d3.select("#restaurantInfo.row").append("svg")
        .attr("width", 600)
        .attr("height", 300);


    // Create the Google Map…
    var map = new google.maps.Map(d3.select("#map-area").node(), {
        zoom: 11,
        center: new google.maps.LatLng(36.1699, -115.1398),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    console.log("ay");

    // Load the station data. When the data comes back, create an overlay.
    d3.json("data/LV_data.json", function(error, data) {
        if (error) throw error;
        data = data.slice(0, 100);
        // console.log(data);
        var overlay = new google.maps.OverlayView();

        // Add the container when the overlay is added to the map.
        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "stations");

            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?
            overlay.draw = function() {
                var projection = this.getProjection(),
                    padding = 10;

                var marker = layer.selectAll("svg")
                    .data(d3.entries(data))
                    .each(transform) // update existing markers
                    .enter().append("svg")
                    .each(transform)
                    .attr("class", "marker");

                // Add a circle.
                marker.append("circle")
                    .attr("r", 4.5)
                    .attr("cx", padding)
                    .attr("cy", padding)
                    .on("click", function(d) {
                        vis.svg.append("text")
                            .attr("x", padding)
                            .attr("y", padding)
                            .attr("dy", ".31em")
                            .text(d.value.name);
                    });

                // Add a label.
                marker.append("text")
                    .attr("x", padding + 7)
                    .attr("y", padding)
                    .attr("dy", ".31em")
                    .text(function(d) { return d.value.name; });

                function transform(d) {
                    d = d.value;
                    d = new google.maps.LatLng(d.latitude, d.longitude);
                    // console.log(d.x);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                }
            };
        };

        // Bind our overlay to the map…
        overlay.setMap(map);
    });
}