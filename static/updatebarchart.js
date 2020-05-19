
function updatebarchart(erorr,ddata){
    d3.select("#barchart svg").remove();

    console.log("ddata-->",ddata);
    data= JSON.parse(ddata);

// set the dimensions and margins of the graph

// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 30, left: 40},
width = 300 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
      .range([height, 0])
      .padding(0.1);

var x = d3.scaleLinear()
      .range([0, width]);
      
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#barchart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");

// format the data
data.forEach(function(d) {
d.count = +d.count;
});

// Scale the range of the data in the domains
x.domain([0, d3.max(data, function(d){ return d.count; })])
y.domain(data.map(function(d) { return d.weaptype1_txt; }));
//y.domain([0, d3.max(data, function(d) { return d.sales; })]);

// append the rectangles for the bar chart
svg.selectAll(".bar")
  .data(data)
.enter().append("rect")
    .transition()
    .duration(700)
  .attr("class", "bar")
  //.attr("x", function(d) { return x(d.sales); })
  .attr("width", function(d) {return x(d.count); } )
  .attr("y", function(d) { return y(d.weaptype1_txt); })
  .attr("height", y.bandwidth())
  .attr("fill","#009599");

// add the x Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// add the y Axis
svg.append("g")
  .call(d3.axisLeft(y));
}

