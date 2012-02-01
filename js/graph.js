var svgSize = [620, 500], // width height
    padding = [4, 20, 20, 30], // top right bottom left
    size = [svgSize[0] - padding[1] - padding[3], svgSize[1] - padding[0] - padding[2]], // width height
    tx = function(d) { return "translate(" + x(d) + ",0)"; },
    ty = function(d) { return "translate(0," + y(d) + ")"; },
    stroke = function(d) { return d ? "#ccc" : "#666"; };

// x-scale
var x = d3.scale.linear()
    .domain([0, 103])
    .range([0, size[0]]);

// y-scale
var y = d3.scale.linear()
    .domain([1500, 0])
    .range([0, size[1]]);
    
// bubble-scale
var b = d3.scale.log()
    .domain([0.005, 2000])
    .range([4, 15]);
    
var storyColour = function(d){
    return "#" + allData.Stories[d.Story].Colour;
};

var svg = d3.select("div#graph").append("svg")
    .attr("width", size[0] + padding[3] + padding[1])
    .attr("height", size[1] + padding[0] + padding[2])
    .attr("pointer-events", "all")
	.append("g")
    .attr("transform", "translate(" + padding[3] + "," + padding[0] + ")");


var fx = x.tickFormat(10),
    fy = y.tickFormat(10);

// x-ticks
var xTicks = svg.append("g")
    .attr("class", "xTicks");
    
var gx = xTicks.selectAll("g.x")
  .data(x.ticks(10), String)
  .attr("transform", tx);

var gxe = gx.enter().insert("g", "a")
  .attr("class", "x")
  .attr("transform", tx);

gxe.append("line")
  .attr("stroke", stroke)
  .attr("y1", 0)
  .attr("y2", size[1]);

gxe.append("text")
  .attr("y", size[1])
  .attr("dy", "1em")
  .attr("text-anchor", "middle")
  .text(fx);

gx.exit().remove();

// y-ticks
var yTicks = svg.append("g")
    .attr("class", "yTicks");

var gy = yTicks.selectAll("g.y")
  .data(y.ticks(10), String)
  .attr("transform", ty);

gy.select("text")
  .text(fy);

var gye = gy.enter().insert("g", "a")
  .attr("class", "y")
  .attr("transform", ty);

gye.append("line")
  .attr("stroke", stroke)
  .attr("x1", 0)
  .attr("x2", size[0]);

gye.append("text")
  .attr("x", -3)
  .attr("dy", ".35em")
  .attr("text-anchor", "end")
  .text(fy);

gy.exit().remove();

var bubbleG = svg.append("g")
    .attr("class", "bubbles");

d3.json("data/data.json", dataLoaded);

function dataLoaded(data){
    allData = data;
    
    var max = d3.max(data.Films, function(d){return d.WorldwideGross;})
    updateSliderMax(max);

    showYear(2011);
}

function renderData(data){
    var bubbles = bubbleG.selectAll("circle")
        .data(data, function(d) { return d.Film; });
        
    bubbles.enter()
        .append("circle")
        .attr("class", "film")
        .attr("fill", storyColour)
        .attr("cx", function(d){return x(d.RottenTomatoes);})
        .attr("cy", function(d){return y(d.Profitability);})
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip)
        .transition().duration(300).delay(function(d, i) { return i * 0.5; })
        .attr("r", function(d){return b(d.WorldwideGross);});
    
    bubbles.exit()
        .transition().duration(300)
        .attr("r", 0).remove();
}

function showTooltip(e, i){    
    var circle = d3.select(this)
        .attr("class", "film highlight");

    bubbleG.node().appendChild(circle.node());

    svg.selectAll("circle.film:not(.highlight)")
        .transition().duration(150)
        .style("fill-opacity", 0.1);

    var tooltip = svg.selectAll("text.tooltip")
        .data([e], function(d){return d.Film;});

    d3.select("#film-name").text(e.Film);
    d3.select("#film-year").text(e.Year);
    d3.select("#film-genre").text(e.Genre);
    d3.select("#film-story").text(e.Story);
    d3.select("#film-rating").text(e.RottenTomatoes + "%");
    d3.select("#film-profitability").text(e.Profitability + "%");
    d3.select("#film-gross").text("$" + e.WorldwideGross + "m");
    d3.select("#film-budget").text("$" + e.Budget + "m");

    var renderLeft = e.RottenTomatoes > 65;
    tooltip.enter()
        .append("text")
        .attr("class", "tooltip")
        .style("text-anchor", renderLeft ? "end" : "start")
        .attr("x", parseFloat(circle.attr("cx")) + parseFloat(circle.attr("r") * (renderLeft ? -1 : 1)))
        .attr("y", parseFloat(circle.attr("cy")) + 3)
        .text(e.Film);
}

function hideTooltip(e, i){
    svg.selectAll("text.tooltip").remove();
    
    d3.selectAll("circle")        
        .transition().duration(50)
        .style("fill-opacity", 0.8)
        .attr("class", "film");
        
    d3.selectAll(".film-datum")
        .text("...");

    d3.select("#film-name").text("Pick a bubble");
}

function highlightYear(year){
    var selection = d3.selectAll(".film")
        .filter(function (d){return d.Year == year})

    highlightSelection(selection);
}

function highlightStories(story){
    var selection = d3.selectAll(".film")
        .filter(function (d){return d.Story.toLowerCase() == story.toLowerCase()});
    
    highlightSelection(selection);
}

function highlightSelection(selection){
    selection.attr("class", "film highlight");

    for(var i = 0; i < selection[0].length; i++)
        bubbleG.node().appendChild(selection[0][i]);

    svg.selectAll("circle.film:not(.highlight)")
        .transition().duration(50)
        .style("fill-opacity", 0.1);
        
    var tooltip = svg.selectAll("text.tooltip")
        .data(selection[0], function(d){return d.__data__.Film;});
    
    var renderLeft;
    tooltip.enter()
        .append("text")
        .attr("class", "tooltip")
        .style("text-anchor", function(d) {
            renderLeft = d.__data__.RottenTomatoes > 65;
            return  renderLeft ? "end" : "start";
        })
        .attr("x", function(d) {
            renderLeft = d.__data__.RottenTomatoes > 65;
            return parseFloat(d3.select(d).attr("cx")) + parseFloat(d3.select(d).attr("r")) * (renderLeft ? -1 : 1);
        })
        .attr("y", function(d) {return parseFloat(d3.select(d).attr("cy")) + 3})
        .text(function(d) {return d.__data__.Film;});
}

function reverseCircleOrder(){
    var circles = d3.selectAll("circle");

    for(var i = circles[0].length - 1; i > 0; i--)
        bubbleG.node().appendChild(circles[0][i]);
}

function unhighlight(){
    d3.selectAll("circle.film")
        .transition().duration(50)
        .style("fill-opacity", 0.8)
        .attr("class", "film");
        
    svg.selectAll("text.tooltip").remove();
}

function removeAllFilms(){
   renderData([]);
}

function showStories(stories){
    var storiesData = allData.Films
        .filter(function (d){return stories.indexOf(d.Story.toLowerCase()) != -1});
    renderData(storiesData);
}

function showYear(year){
    var yearData = allData.Films.filter(function (d){return d.Year == year})
        .sort(function (a,b){return b.WorldwideGross - a.WorldwideGross;});
    renderData(yearData);
}

function showYears(years){
    var yearData = allData.Films.filter(function (d){return years.indexOf(d.Year) != -1;})
        .sort(function (a,b){return b.WorldwideGross - a.WorldwideGross;});
    renderData(yearData);    
}

function showFiltered(years, stories, grossRange){
   var filteredData = allData.Films
        .filter(function (d){return years.indexOf(d.Year) != -1;})
        .filter(function (d){return d.WorldwideGross >= grossRange[0] && d.WorldwideGross <= grossRange[1];})
        .filter(function (d){return stories.indexOf(d.Story.toLowerCase()) != -1})
        .sort(function (a,b){return b.WorldwideGross - a.WorldwideGross;});

    renderData(filteredData);
}