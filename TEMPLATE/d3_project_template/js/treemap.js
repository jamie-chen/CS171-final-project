var restaurant_categories = ["Fast Food",
    "American (Traditional)",
    "Italian",
    "Breakfast & Brunch",
    "Mexican",
    "Chinese",
    "Japanese",
    "American (New)",
    "Diners",
    "Burgers"];

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
    vis.treeMapData = [];
    // Initialize dataset, count of each restaurant category
    restaurant_categories.forEach(function(d) {
        if (vis.countCategory(d) <= 2) { return ;}
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
        color = d3.scale.ordinal()
            .domain([0, 100])
            .range(d3.schemeReds[9]),
        root,
        node;
    d3.select("svg").remove();

    vis.treemap = d3.layout.treemap()
        .round(true)
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d.count; });

    // Create SVG to append values to
    vis.svg = d3.select(vis.parentElement).append("div")
        .attr("class", "chart")
        .attr("id", "treemap-container")
        .style("width", width + "px")
        .style("height", height + "px")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "treemap-svg")
        .attr("transform", "translate(.5,.5)");

    var nodes = vis.treemap.nodes(vis.treeMapData)
        .filter(function(d) { return !d.children});
    console.log("nodes are");
    console.log(nodes);

    vis.cell = vis.svg.selectAll("g")
        .data(nodes)
        .enter().append("svg:g")
        .attr("class", "cell")
        .attr("transform", function(d) {
            console.log(d);
            return "translate(" + d.x + "," + d.y + ")"; });

    vis.cell.append("svg:rect")
        .attr("width", function(d) {
            console.log("hello");
            console.log(d);
            return d.dx - 1; })
        .attr("height", function(d) { return d.dy - 1; })
        .on("click", function(d) {
            console.log(d);
            updateVisualization(d.name);
            d3.select("#selected-cat")
                .text("Selected Category: " + d.name);

        })
        .on("mouseover", function(d){
            d3.select(this).style("fill", function() {return d3.rgb(d3.select(this).style("fill")).darker(0.3);}) })
        .on("mouseout", function(d){
            d3.select(this).style("fill", function() {return d3.rgb(d3.select(this).style("fill")).darker(-0.3);}) })
        .transition()
        .style("fill", function(d) {return color(d.name); });

    vis.cell.append("svg:text")
        .attr("x", function(d) { return d.dx / 2; })
        .attr("y", function(d) { return d.dy / 2 - 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("class", "treemap-text")
        .style("font-size", function(d) {return d.dx / 13 + "px"})

        .text(function(d) { return d.name })

        .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

    vis.cell.append("svg:text")
        .attr("x", function(d) { return d.dx / 2; })
        .attr("y", function(d) { return d.dy / 2 + d.dx/13; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("class", "treemap-text")
        .style("font-size", function(d) {return d.dx / 13 + "px"})
        .text(function(d) { return d.count; })

        .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

    console.log("Should remove");
    console.log(color);
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

TreeMap.prototype.updateVis = function(newData) {
    var vis = this;

    // d3.selectAll("g").remove();
    d3.select("#treemap-container").remove();
    console.log("Should remove");
    vis.data = newData;
    vis.svg.select("#treemap-svg").selectAll("g").remove();
    vis.initVis();

}