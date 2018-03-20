(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.heatmap = global.heatmap || {})));
}(this, (function (exports) { 'use strict';
/////////////////////////////////////////////////////////////////////////////////////

var lots = [
	[565, 91], //Quad
	[577, 427], //Gateway
	[352, 226], //Pavilion
	[566, 447], //1
	[563, 466], //2
	[538, 322], //3
	[615, 340], //4
	[642, 256], //5a
	[658, 253], //5
	[572, 263], //6
	[652, 206], //10
	[510, 105], //14
	[475, 90], //15
	[419, 77], //16
	[453, 133], //20
	[429, 86], //21
	[394, 78], //22
	[363, 131], //25
	[412, 187], //26
	[436, 175], //27
	[232, 231], //30
	[0, 0], //31 //not on map
	[270, 124], //35
	[346, 262], //40
	[371, 264], //41
	[416, 282], //42
	[0, 0], //43 //can't find
	[0, 0], //43b //can't find
	[427, 347], //44
	[465, 380], //46
	[390, 378], //47
	[327, 319], //48
	[318, 411], //49
	[240, 463], //50
	[176, 466], //51
	[171, 423], //52
	[155, 394], //53
	[264, 494], //54
	[244, 492], //55
	[230, 369], //56 //56a not on inventory
	[126, 422], //57
	[0, 0], //80 //not on map
	[0, 0], //81 //not on map
	[0, 0], //82 //not on map
	[0, 0] //83 //not on map
];

function MakeHeatmap (permit, toggle)
{
	d3.csv('UPDATED_TAPS_PARKING_INVENTORY_-_INVN395.csv', function (data) {
		var dataset = [];
		var lotsPos = [];
		var total = 0;
		var max = 0;

		var cnt = 0;
		data.forEach(function (d) {
			//console.log(cnt);
			if (lots[cnt][0] != 0 && lots[cnt][1] != 0)
			{
				var newObj = {
					name: d.PARKING_LOTS,
					value: parseInt(d[permit]),
					pos: lots[cnt]
				};
				if (newObj.value > max)
					max = newObj.value;
				total += newObj.value;
				lotsPos.push(lots[cnt]);
				dataset.push(newObj);
			}
			cnt++;
		});

		DrawVoronoi(lotsPos, dataset, total, max, toggle);
	});
}

function DrawVoronoi (lotsPos, dataset, total, max, toggle)
{
	var width = 779;
	var height = 671;

	var voronoi = d3.voronoi()
			.extent([[0, 0],[width, height]]);
	var polys = voronoi.polygons(lotsPos);
	
	var svg = d3.select('.voronoi')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate(159,24)');
	
	var voronoiGroup = svg.selectAll('vor')
			.data(polys);
	
	var circles = svg.selectAll('lot')
			.data(dataset);

	var tooltip = d3.select('body')
			.append("div")
			.attr('class', 'tooltip')
			.style("display", "none")
	
	voronoiGroup.exit().remove();
	circles.exit().remove();

	voronoiGroup
		.enter()
		.append("path")
		.attr("class", "vor")
		.attr("d", function(d) { return polygon(d); })
		.style('stroke', 'black')
		.style('fill', function(d, i) { 
			var t = ((max - dataset[i].value) / max) * 0.8 + 0.1;
			var c = d3.interpolateSpectral(t);
			var o = [c.slice(0, 3), 'a', c.slice(3)].join('');
			var a = ', 0.01';
			if (toggle) a = ', 1';
			o = [o.slice(0, o.length - 1), a, o.slice(o.length - 1)].join('');
			return o;
		})
		.on("mouseover", function() {
			return tooltip
				.style("display", "inline");
		})
		.on("mousemove", function(d, i) {
			return tooltip
				.text(dataset[i].name)
				.style("left", (d3.event.pageX - 34) + "px")
				.style("top", (d3.event.pageY - 12) + "px")
				.style('stroke', 'black');
		})
		.on("mouseout", function() {
			return tooltip
				.style("display", "none");
		});

	circles
		.enter()
		.append("circle")
		.attr("class", "lotpoint")
		.attr("r", 4)
		.attr("cx",function(d){ return d.pos[0]; })
		.attr("cy",function(d){ return d.pos[1]; })
		.style('stroke', 'black')
		.style('fill', 'white');
}

function polygon(d) 
{
	return "M" + d.join("L") + "Z";
}

exports.MakeHeatmap = MakeHeatmap;

/////////////////////////////////////////////////////////////////////////////////////
Object.defineProperty(exports, '__esModule', { value: true });
})));