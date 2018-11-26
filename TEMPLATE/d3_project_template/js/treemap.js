var restaurant_categories = ["Fast Food",
    "American (Traditional)",
    "Italian",
    "Breakfast & Brunch",
    "Mexican",
    "Chinese",
    "Japanese",
    "American (New)",
    "Diners",
    "Burgers",
    "French"];

/*
 * TreeMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data				-- the Yelp data: data
 */
TreeMap = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.treeMapData = [];
    console.log(data);

    data.forEach(function(d) {
        console.log(d.categories);
    });

    this.initVis();
};

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */
TreeMap.prototype.initVis = function() {
    var vis = this;

    // Initialize dataset, count of each restaurant category
    restaurant_categories.forEach(function(d) {
        vis.treeMapData.push({
            name: d,
            count: vis.countCategory(d)
        });
        vis.treeMapData["children"] = vis.treeMapData;
    });

    console.log(vis.treeMapData);

    // Define TreeMap size
    var width = $("#treemaps").width(),
        height = 300,
        x = d3.scale.linear().range([0, width]),
        y = d3.scale.linear().range([0, height]),
        color = d3.scale.category20c(),
        root,
        node;

    vis.treemap = d3.layout.treemap()
        .round(true)
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d.count; });

    // Create SVG to append values to
    vis.svg = d3.select(vis.parentElement).append("div")
        .attr("class", "chart")
        .style("width", width + "px")
        .style("height", height + "px")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("transform", "translate(.5,.5)");

    var nodes = vis.treemap.nodes(vis.treeMapData)
        .filter(function(d) { return !d.children});

    console.log(nodes);

    var cell = vis.svg.selectAll("g")
        .data(nodes)
        .enter().append("svg:g")
        .attr("class", "cell")
        .attr("transform", function(d) {
            console.log(d);
            return "translate(" + d.x + "," + d.y + ")"; });

    cell.append("svg:rect")
        .attr("width", function(d) {
            console.log("hello");
            console.log(d);
            return d.dx - 1; })
        .attr("height", function(d) { return d.dy - 1; })
        .style("fill", function(d) {return color(d.name); });

    cell.append("svg:text")
        .attr("x", function(d) { return d.dx / 2; })
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name + ": " + d.count; })
        .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });
}

/*
 * Counts the number of restaurants of a given category (e.g. "Japanese")
 */
TreeMap.prototype.countCategory = function(category) {
    var vis = this;
    var counter = 0;

    vis.data.forEach(function(d) {
        if (!d.categories) {
            return;
        }
        var temp_categories = d.categories;
        if (temp_categories.includes(category)) {
            counter += 1;
        }
    })

    return counter;
};