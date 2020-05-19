// var datapie = [{"weaptype1_txt":"Biological","count":35},
// {"weaptype1_txt":"Chemical","count":336},
// {"weaptype1_txt":"Explosives","count":96407},
// {"weaptype1_txt":"Fake Weapons","count":33},
// {"weaptype1_txt":"Firearms","count":61885},
// {"weaptype1_txt":"Incendiary","count":11791},
// {"weaptype1_txt":"Melee","count":3905},
// {"weaptype1_txt":"Other","count":127},
// {"weaptype1_txt":"Radiological","count":13},
// {"weaptype1_txt":"Sabotage Equipment","count":158},
// {"weaptype1_txt":"Unknown","count":16621},
// {"weaptype1_txt":"Vehicle (not to include vehicle-borne explosives, i.e., car or truck bombs)","count":153}];
var text = "";


function drawpie(error,db){
if (error) throw error;
console.log("db",db);
datapie=JSON.parse(db);
console.log("datapie",datapie);

d3.select("#piechart svg").remove();
d3.select("#piechartlegend div").remove();

// document.getElementById("#piechartlegend").remove();
var widthpie = 300;
var heightpie= 240;
var thicknesspie = 40;
var durationpie = 750;
var paddingpie = 0;
var opacitypie = .8;
var opacityHoverpie = 1;
var otherOpacityOnHoverpie = .8;
var tooltipMarginpie = 0;

var radius = Math.min(widthpie-paddingpie, heightpie-paddingpie) / 2;
var color = d3.scaleOrdinal().domain(datapie)
  .range(d3.schemeOranges[7]);

var svg3 = d3.select("#piechart")
.append('svg')
.attr('class', 'pie')
.attr('width', widthpie)
.attr('height', heightpie);

var g1 = svg3.append('g')
.attr('transform', 'translate(' + (widthpie/2) + ',' + (heightpie/2) + ')');

var arc = d3.arc()
.innerRadius(0)
.outerRadius(radius);

var pie = d3.pie()
.value(function(d) { return d.count; })
.sort(null);

var pathpie = g1.selectAll('path')
  .data(pie(datapie))
  .enter()
  .append("g")  
  .append('path')
  .attr('d', arc)
  .attr('fill', (d,i) => color(i))
  .style('opacity', opacitypie)
  .style('stroke', 'white')
  .on("mouseover", function(d) {
      d3.selectAll('path')
        .style("opacity", otherOpacityOnHoverpie);
      d3.select(this) 
        .style("opacity", opacityHoverpie);

      let g1 = d3.select("svg")
        .style("cursor", "pointer")
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);
 
      g1.append("text")
        .attr("class", "name-text")
        .text(`${d.data.success} (${d.data.count})`)
        .attr('text-anchor', 'middle');
    
      let textpie = g1.select("text");
      let bboxpie = textpie.node().getBBox();
      let paddingpie = 2;
      g1.insert("rect", "text")
        .attr("x", bboxpie.x - paddingpie)
        .attr("y", bboxpie.y - paddingpie)
        .attr("width", bboxpie.width + (paddingpie*2))
        .attr("height", bboxpie.height + (paddingpie*2))
        .style("fill", "white")
        .style("opacity", 0.75);
    })
  .on("mousemove", function(d) {
        let mousePositionpie = d3.mouse(this);
        let x = mousePositionpie[0] + widthpie/2;
        let y = mousePositionpie[1] + heightpie/2 - tooltipMarginpie;
    
        let textpie = d3.select('.tooltip text');
        let bboxpie = textpie.node().getBBox();
        if(x - bboxpie.width/2 < 0) {
          x = bboxpie.width/2;
        }
        else if(widthpie - x - bboxpie.width/2 < 0) {
          x = widthpie - bboxpie.width/2;
        }
    
        if(y - bboxpie.height/2 < 0) {
          y = bboxpie.height + tooltipMarginpie * 2;
        }
        else if(heightpie - y - bboxpie.height/2 < 0) {
          y = heightpie - bboxpie.height/2;
        }
    
        d3.select('.tooltip')
          .style("opacity", 1)
          .attr('transform',`translate(${x}, ${y})`);
    })
  .on("mouseout", function(d) {   
      d3.select("svg")
        .style("cursor", "none")  
        .select(".tooltip").remove();
    d3.selectAll('path')
        .style("opacity", opacitypie);
    })
  .on("touchstart", function(d) {
      d3.select("svg")
        .style("cursor", "none");    
  })
  .each(function(d, i) { this._current = i; });

let legend = d3.select("#piechartlegend").append('div')
			.attr('class', 'legend')
			.style('margin-top', '30px');

let keys = legend.selectAll('.key')
			.data(datapie)
			.enter().append('div')
			.attr('class', 'key')
			.style('display', 'flex')
			.style('align-items', 'center')
			.style('margin-right', '20px');

		keys.append('div')
			.attr('class', 'symbol')
			.style('height', '10px')
			.style('width', '10px')
			.style('margin', '5px 5px')
			.style('background-color', (d, i) => color(i));

		keys.append('div')
			.attr('class', 'name')
			.text(d => `${d.success} (${d.count})`);

    keys.exit().remove();
}
// var pieglobal = d3.queue().defer(d3.json, "/getDataPerCountryPie?country=All");
d3.queue().defer(d3.json, "/getDataPerCountryPie?country=All")
.await(drawpie);
console.log("hello!");
//call for first run
// drawpie(JSON.parse(pieglobal._data[0]));