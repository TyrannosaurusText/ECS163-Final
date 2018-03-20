
//Source: https://bl.ocks.org/alandunning/4c36eb1abdb248de34c64f5672afd857
//slightly modified

var RadarChart = {
  draw: function(id, dat, options){
    var cfg = {
     radius: 5,
     w: 600,
     h: 600,
     factor: 1,
     factorLegend: .85,
     levels: 10,
     maxValue: 5,
     radians: 2 * Math.PI,
     opacityArea: 0.1,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 100,
     ExtraWidthY: 100,
     color: d3.scaleOrdinal().range(["#6F257F", "#6AC6FF"])};
	//console.log(dat)
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    
    
    var allAxis = (dat[0].map(function(i, j){return i.Pass}));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    d3.select(id).select("svg").remove();
	
	var width = cfg.w+cfg.ExtraWidthX;
	var height = cfg.h+cfg.ExtraWidthY;
	
	var zoom = d3.zoom()
    .on("zoom", radarzoom);
	
    var g = d3.select(id)
        .append("svg")
		.attr("class", "radar-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g").attr("class", "chart")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")
		

	var radarsvg = d3.select(id)
	.select("svg").call(zoom);
	
		
	d3.select(id).select("svg").append("rect")
    .attr("class", "zoom")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
   
	var tooltip;
	g.append("g").attr("class","seg")
	//Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.select(".seg").selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }
	g.append("g").attr("class","legend");
    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.select(".legend").selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text(cfg.maxValue*(j)/(cfg.levels-1));
    }

    series = 0;
	g.append("g").attr("class","axisWrapper");
	g.append("g").attr("class","poly");
	g.append("g").attr("class","circ");
var tooltip = d3.select("body").append("div").attr("class", "radar-toolTip");
	for( i = 0; i < dat.length; i++)
	{	
		//console.log(cfg.color(series))
		var allAxis = (dat[i].map(function(i, j){return i.Pass}));
		var axis = g.select(".axisWrapper").selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "radar-axis");
	
		axis.append("line")
		  .attr("x1", cfg.w/2)
		  .attr("y1", cfg.h/2)
		  .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		  .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		  .attr("class", "line")
		  .style("stroke", "grey")
		  .style("stroke-width", "1px");

		axis.append("text")
		  .attr("class", "legend")
		  .text(function(d){return d})
		  .style("font-family", "sans-serif")
		  .style("font-size", "11px")
		  .attr("text-anchor", "middle")
		  .attr("dy", "1.5em")
		  .attr("transform", function(d, i){return "translate(0, -10)"})
		  .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		  .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

	 
		  dataValues = [];
		[dat[i]].forEach(function(y, x){
			//console.log(y, x)
		  g.selectAll(".nodes")
		  .data(y, function(j, i){
			y = cfg.maxValue/(cfg.levels-1);
			x = ((parseFloat(Math.max(j.value, 0))+y)/(cfg.maxValue+y))
			dataValues.push([
			cfg.w/2*(1-x*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-x*cfg.factor*Math.cos(i*cfg.radians/total))
			]);
		  });
		  //console.log(dataValues);
		  dataValues.push(dataValues[0]);
		  g.select(".poly").selectAll(".area")
				 .data([dataValues])
				 .enter()
				 .append("polygon")
				 .attr("class", "radar-chart-series"+series)
				 .style("stroke-width", "2px")
				 .style("stroke", cfg.color(series))
				 .attr("points",function(d) {
				   var str="";
				   for(var pti=0;pti<d.length;pti++){
					 str=str+d[pti][0]+","+d[pti][1]+" ";
				   }
				   return str;
				  })
				 .style("fill", function(j, i){return cfg.color(series)})
				 .style("fill-opacity", cfg.opacityArea)
				 .on('mouseover', function (d){
						  z = "polygon."+d3.select(this).attr("class");
						  g.selectAll("polygon")
						   .transition(200)
						   .style("fill-opacity", 0.1); 
						  g.selectAll(z)
						   .transition(200)
						   .style("fill-opacity", .7);
						  })
				 .on('mouseout', function(){
						  g.selectAll("polygon")
						   .transition(200)
						   .style("fill-opacity", cfg.opacityArea);
				 });
		});

		[dat[i]].forEach(function(y, x){
		  g.select(".circ").selectAll(".nodes")
		  .data(y).enter()
		  .append("svg:circle")
		  .attr("class", "radar-chart-series"+series)
		  .attr('r', cfg.radius)
		  .attr("alt", function(j){return Math.max(j.value, 0)})
		  .attr("cx", function(j, i){
			y = cfg.maxValue/(cfg.levels-1);
			x = ((parseFloat(Math.max(j.value, 0))+y)/(cfg.maxValue+y))
		  return cfg.w/2*(1-x*cfg.factor*Math.sin(i*cfg.radians/total));
		  })
		  .attr("cy", function(j, i){
			y = cfg.maxValue/(cfg.levels-1);
			x = ((parseFloat(Math.max(j.value, 0))+y)/(cfg.maxValue+y))
			return cfg.h/2*(1-x*cfg.factor*Math.cos(i*cfg.radians/total))
		  })
		  .attr("data-id", function(j){return j.area})
		  .style("fill", "#fff")
		  .style("stroke-width", "2px")
		  .style("stroke", cfg.color(series)).style("fill-opacity", .9)
		  .on('mouseover', function (d){
			  var string = d.Pass;
			  
			//console.log(tooltip.style("width"))
				tooltip
				  .style("left", d3.event.pageX - 60 -5*(string.length) + "px")
				  .style("top", d3.event.pageY - 100 + "px")
				  .style("display", "inline-block")
						.html("Lot:" + (d.Lot)+ "<br><span>Permit Level: "+ (d.Pass) + "<br><span> value: " + d.value + "</span>");
				})
				.on("mouseout", function(d){ tooltip.style("display", "none");})
				.on("click",function(d) {
						

				});
		});
		series++;
	
	}
	
	var element = g.select('.axisWrapper').node(); //resizing svg
	element.getBoundingClientRect().width;
	var bbox=element.getBoundingClientRect();
	width = Math.ceil(bbox.width);
	height = Math.ceil(bbox.height);
	radarsvg.attr("width", width);
	radarsvg.attr("height",height);
	zoom.scaleExtent([.9, 8])
	.translateExtent([[-40, -30], [width, height]]);
	radarsvg.call(zoom.transform, d3.zoomIdentity.translate(40, 30).scale(0.9))
	
	function radarzoom() {
	  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "radar-chart") return; // ignore zoom-by-brush
	  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
	  g.attr("transform", d3.event.transform); // updated for d3 v4
	}
  }
  
  
};
