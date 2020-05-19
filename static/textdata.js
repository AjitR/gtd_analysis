function drawtext(error, data){
    
    d3.select("#text1 svg").remove();
    var svg1 = d3.select("#text1").append("svg")
                                     .attr("width",376)
                                      .attr("height",348);

  var text1 = svg1.append("text").attr("x",170).attr("y",30).text("Incidents").attr("fill","#ccc").attr("stroke","#ccc").attr("text-anchor","middle")
  .style("font-size", "22px");

  svg1.append("text").attr("x",170).attr("y",80).text(data.incidents).attr("text-anchor","middle")
  .style("font-size", "55px").style("fill","#FF884D");

  svg1.append("text").attr("x",170).attr("y",140).text("Casulties").attr("fill","#ccc").attr("stroke","#ccc").attr("text-anchor","middle")
  .style("font-size", "22px");

  svg1.append("text").attr("x",170).attr("y",190).text(data.casulties).attr("text-anchor","middle")
  .style("font-size", "55px").style("fill","#FF884D");

  svg1.append("text").attr("x",170).attr("y",250).text("Wounded").attr("fill","#ccc").attr("stroke","#ccc").attr("text-anchor","middle")
  .style("font-size", "22px");

  svg1.append("text").attr("x",170).attr("y",300).text(data.wounded).attr("text-anchor","middle")
  .style("font-size", "55px").style("fill","#FF884D");

}


d3.queue().defer(d3.json, "/getTextData?country=All")
.await(drawtext);
