var svgSize = [900, 500], // width height
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
    .domain([1200, 0])
    .range([0, size[1]]);
    
// bubble-scale
var b = d3.scale.log()
    .domain([0.005, 2000])
    .range([0, 13]);

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

d3.json("data/data.json", renderData);

function renderData(data){
    console.log(data.Stories);
    
    var storyColour = function(d){
        return "#" + data.Stories[d.Story].Colour;
    };
    
    var bubbleG = svg.append("g")
        .attr("class", "bubbles");

    var bubbles = bubbleG.selectAll("circle")
        .data(data.Films.sort(function (a,b){return b.WorldwideGross - a.WorldwideGross;}))
        .enter()
        .append("circle")
        .attr("class", "film")
        .attr("fill", storyColour)
        .attr("cx", function(d){return x(d.RottenTomatoes);})
        .attr("cy", function(d){return y(d.Profitability);})
        .transition().duration(500).delay(function(d, i) { return i * 5; })
        .attr("r", function(d){return b(d.WorldwideGross);});
        
}
