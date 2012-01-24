var svgSize = [620, 500], // width height
    padding = [4, 20, 20, 30], // top right bottom left
    size = [svgSize[0] - padding[1] - padding[3], svgSize[1] - padding[0] - padding[2]], // width height
    tx = function(d) { return "translate(" + x(d) + ",0)"; },
    ty = function(d) { return "translate(0," + y(d) + ")"; },
    stroke = function(d) { return d ? "#ccc" : "#666"; };

// x-scale
var x = d3.scale.linear()
    .domain([0, 100])
    .range([0, size[0]]);

// y-scale
var y = d3.scale.linear()
    .domain([1500, 0])
    .range([0, size[1]]);
    
// bubble-scale
var b = d3.scale.log()
    .domain([0.005, 2000])
    .range([0, 13]);
    
var storyColour = function(d){
    return "#" + allData.Stories[d.Story].Colour;
};

var svg = d3.select("div#graph").append("svg")
    .attr("width", size[0] + padding[3] + padding[1])
    .attr("height", size[1] + padding[0] + padding[2])
    .attr("pointer-events", "all")
	.append("g")
    .attr("transform", "translate(" + padding[3] + "," + padding[0] + ")");

svg.append("rect")
    .attr("class", "background")
    .attr("width", size[0])
    .attr("height", size[1])
    .attr("stroke", "none");

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
    
    // d3.select(".controls .well .stories")
    // .selectAll("button")
    // .data(d3.keys(allData.Stories))
    // .enter()
    // .append("button")
    // .attr("class", "btn small")
    // .text(function(d){return d})
    // .style("background-color", function(d){return "#" + allData.Stories[d].Colour})
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
        .transition().duration(500).delay(function(d, i) { return i * 2; })
        .attr("r", function(d){return b(d.WorldwideGross);});
    
    bubbles.exit()
        .transition().duration(500)
        .attr("r", 0).remove();
}

function showTooltip(e, i){
    // console.log(e);
    // console.log(this);
    
    var circle = d3.select(this)
        .attr("class", "film highlight");
    
    svg.selectAll("circle.film:not(.highlight)")
        .transition().duration(150)
        .style("fill-opacity", 0.1);

    var tooltip = svg.selectAll("text.tooltip")
        .data([e], function(d){return d.Film;});
    
    tooltip.enter()
        .append("text")
        .attr("class", "tooltip")
        .attr("x", parseFloat(circle.attr("cx")) + parseFloat(circle.attr("r")))
        .attr("y", parseFloat(circle.attr("cy")) + 3)
        .text(e.Film);
   
    tooltip.attr("display", "inline")
   
    tooltip.exit().remove();
}

function hideTooltip(e, i){
    svg.selectAll("text.tooltip").attr("display", "none");
    
    d3.selectAll("circle")        
        .transition().duration(150)
        .style("fill-opacity", 0.8)
        .attr("class", "film");
}

function highlightYear(year){
    var selection = d3.selectAll(".film")
        .filter(function (d){return d.Year == year})
        .attr("class", "film highlight")
        .style("fill-opacity", 1);
        
    svg.selectAll("circle.film:not(.highlight)")
        .transition().duration(150)
        .style("fill-opacity", 0.1);
}

function highlightStories(story){
    var selection = d3.selectAll(".film")
        .filter(function (d){return d.Story.toLowerCase() == story.toLowerCase()})
        .attr("class", "film highlight")        
        .style("fill-opacity", 1);
        
    svg.selectAll("circle.film:not(.highlight)")
        .transition().duration(150)
        .style("fill-opacity", 0.1);
}

function unhighlight(){
    d3.selectAll("circle.film")
        .transition().duration(150)
        .style("fill-opacity", 0.8)
        .attr("class", "film");
}

function removeFilmSelection(selection){
    selection
        .transition()
        .duration(300)
        .attr("r", 0);
        //.remove();
}

function showFilmSelection(selection){
    selection
        .transition()
        .duration(300)
        .attr("r", function(d){return b(d.WorldwideGross);});
}

function removeAllFilms(){
    var selection = d3.selectAll(".film");
    removeFilmSelection(selection);
}

function removeStory(story){
    var selection = d3.selectAll(".film")
        .filter(function (d){return d.Story.toLowerCase() == story.toLowerCase()});
    removeFilmSelection(selection);
}

function showOnlyStory(story){
    var selection = d3.selectAll(".film")
        .filter(function (d){return d.Story.toLowerCase() != story.toLowerCase()});
    removeFilmSelection(selection);
}

function showStory(story){
    var selection = d3.selectAll(".film")
        .filter(function (d){return d.Story.toLowerCase() == story.toLowerCase()});
    showFilmSelection(selection);
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
        .filter(function (d){return stories.indexOf(d.Story.toLowerCase()) != -1})
        .filter(function (d){return d.WorldwideGross >= grossRange[0] && d.WorldwideGross <= grossRange[1];})
        .sort(function (a,b){return b.WorldwideGross - a.WorldwideGross;});

    renderData(filteredData);    

}