var ddata = [{"weaptype1_txt":"Biological","count":35},{"weaptype1_txt":"Chemical","count":336},{"weaptype1_txt":"Explosives","count":96407},{"weaptype1_txt":"Fake Weapons","count":33},{"weaptype1_txt":"Firearms","count":61885},{"weaptype1_txt":"Incendiary","count":11791},{"weaptype1_txt":"Melee","count":3905},{"weaptype1_txt":"Other","count":127},{"weaptype1_txt":"Radiological","count":13},{"weaptype1_txt":"Sabotage Equipment","count":158},{"weaptype1_txt":"Unknown","count":16621},{"weaptype1_txt":"Vehicle (not to include vehicle-borne explosives, i.e., car or truck bombs)","count":153}];

//var ddata =[{"salesperson":"Bob","sales":33},{"salesperson":"Robin","sales":12},{"salesperson":"Anne","sales":41},{"salesperson":"Mark","sales":16},{"salesperson":"Joe","sales":59},{"salesperson":"Eve","sales":38},{"salesperson":"Karen","sales":21},{"salesperson":"Kirsty","sales":25},{"salesperson":"Chris","sales":30},{"salesperson":"Lisa","sales":47},{"salesperson":"Tom","sales":5},{"salesperson":"Stacy","sales":20},{"salesperson":"Charles","sales":13},{"salesperson":"Mary","sales":29}];

function ddraw(data){
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#barchart2").append("svg")
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
      .attr("height", y.bandwidth());

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

}


ddraw(ddata);