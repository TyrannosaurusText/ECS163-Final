// Config for the Radar chart
var defaultconfig = {
    w: 300,
    h: 300,
    maxValue: 835,
    levels: 6,
    ExtraWidthX: 300,
    color: d3.scaleOrdinal().range([ //colors from http://godsnotwheregodsnot.blogspot.ru/2012/09/color-distribution-methodology.html
    'rgba(  0,  0,  0,1)',
    'rgba(  1,  0,103,1)',
    'rgba(255,  0, 86,1)',
    'rgba(158,  0,142,1)',
    'rgba( 14, 76,161,1)',
    'rgba(255,229,  2,1)',
    'rgba(  0, 95, 57,1)',
    'rgba(  0,255,  0,1)',
    'rgba(149,  0, 58,1)',
    'rgba(255,147,126,1)',
    'rgba(164, 36,  0,1)',
    'rgba(  0, 21, 68,1)',
    'rgba(145,208,203,1)',
    'rgba( 98, 14,  0,1)',
    'rgba(107,104,130,1)',
    'rgba(  0,  0,255,1)',
    'rgba(  0,125,181,1)',
    'rgba(106,130,108,1)',
    'rgba(  0,174,126,1)',
    'rgba(194,140,159,1)',
    'rgba(190,153,112,1)',
    'rgba(  0,143,156,1)',
    'rgba( 95,173, 78,1)',
    'rgba(255,  0,  0,1)',
    'rgba(255,  0,246,1)',
    'rgba(255,  2,157,1)',
    'rgba(104, 61, 59,1)',
    'rgba(255,116,163,1)',
    'rgba(150,138,232,1)',
    'rgba(152,255, 82,1)',
    'rgba(167, 87, 64,1)',
    'rgba(  1,255,254,1)',
    'rgba(255,238,232,1)',
    'rgba(254,137,  0,1)',
    'rgba(189,198,255,1)',
    'rgba(  1,208,255,1)',
    'rgba(187,136,  0,1)',
    'rgba(117, 68,177,1)',
    'rgba(165,255,210,1)',
    'rgba(255,166,254,1)',
    'rgba(119, 77,  0,1)',
    'rgba(122, 71,130,1)',
    'rgba( 38, 52,  0,1)',
    'rgba(  0, 71, 84,1)',
    'rgba( 67,  0, 44,1)',
    'rgba(181,  0,255,1)',
    'rgba(255,177,103,1)',
    'rgba(255,219,102,1)',
    'rgba(144,251,146,1)',
    'rgba(126, 45,210,1)',
    'rgba(189,211,147,1)',
    'rgba(229,111,254,1)',
    'rgba(222,255,116,1)',
    'rgba(  0,255,120,1)',
    'rgba(  0,155,255,1)',
    'rgba(  0,100,  1,1)',
    'rgba(  0,118,255,1)',
    'rgba(133,169,  0,1)',
    'rgba(  0,185, 23,1)',
    'rgba(120,130, 49,1)',
    'rgba(  0,255,198,1)',
    'rgba(255,110, 65,1)',
    'rgba(232, 94,190,1)',
])
}
var Lots = [];
var permits = ["A","C","DISABLED","METER","TIMEZONE","CARPOOL","ELECTRIC","RESTRICTED","MOTORCYCLE","OTHER"]

function radarAddLot(lot)
{
	if(Lots.includes(lot))
		Lots.splice(Lots.indexOf(lot),1); //remove lot
	else
		Lots.push(lot) // add lot
	
	console.log(Lots)
	if(Lots.length > 0){
		d3.select(".radar").text("");
		radar(".radar", Lots, permits, defaultconfig);
	}
	else
		d3.select(".radar").text("No Lots selected, click on the Heat Map to add Lots to the Radar Chart")
}

d3.select(".radar").text("No Lots selected, change Select Mode to Heat Map then click a lots to the Radar Chart")
// Example call: radar( ".radarChart",["LOT 1", "LOT 2", "LOT 3", "LOT 4"], ["A", "C", "METER"])
//Call function to draw the Radar chart

function radar(id, lots, permits,config=defaultconfig)
{

	
	//console.log(permits.length)
	if(permits.length < 3){
		d3.select(id).text("Requires at least 3 parameters for permit")
		return
	}
	var radarData;
	d3.json("data.json", function(error, radarData) {
		if (error) throw error;

		var x =0;
		var arr = []		
		//console.log(radarData)
		
		for(i in radarData)
		{
			//console.log(radarData[i][0].Lot)
			if(lots.includes(radarData[i][0].Lot))
			{
				arr[x] = radarData[i];
				x++;
			}
		}
		//console.log(radarData)
		//console.log(arr)
		
		
		arrForPermits = [];
		x = 0;
		for( i in arr ) //for each lot in arr
		{
			Area = []
			arrForPermits[i]=[]; 
			for( p in arr[0] ) 
			{	//push if accepted permit
				if( permits.includes(arr[i][p].Pass) )
				{
					arrForPermits[i].push(arr[i][p])
				}
			}
		}
		
		arrForPermits = arrForPermits.sort(function(a,b){ //sort arr from most to least parking
			//console.log(a,b)
			sumA = getRadarArea(a)
			sumB = getRadarArea(b)
			//console.log(sumA, sumB)
			if (sumA < sumB) return 1;
			else return -1;
		
		});
		config.maxValue = radarfindmax(arrForPermits); // finds max val for radar axis

		//console.log(arrForPermits)
		
		RadarChart.draw(id, arrForPermits, config);

	});
}
function getRadarArea(arr)
{
	area = 1;
	for( i in arr )
		area*=(1+parseInt(arr[i].value))
	return area;
}
function radarfindmax( TwoDeepArray )
{
	var max = 0;
	var val;
	for(OneDeepArray in TwoDeepArray){
		for ( One in TwoDeepArray[OneDeepArray] )
		{	
			//console.log(TwoDeepArray[OneDeepArray][One].value)
			val = parseInt(TwoDeepArray[OneDeepArray][One].value);
			if(max < val)
				max = val;
			//console.log(max)
		}
	}
	return max;
}

	//just converts CSV to JSON for faster processing.
//only need to call if CSV updates.

function CSV2JSON(csv = "a.csv")
{
	d3.csv(csv, function(error, data) {
	if(error) throw error;
	console.log(data);
	var lot = [];
	var arr = [];
	var x=0;
	data.forEach( function(d){
		arr[x] = [];
		for( i in d )
		{
			lot[x] = i;
			if(i != "PARKING LOTS")
				arr[x].push({"Pass":i, "Lot":d["PARKING LOTS"], "value":d[i]});
		}
		x++;
		//console.log(arr[x])
	});
	console.log(arr)
	
	arr = arr.sort(function(a,b){ //sort arr from most to least parking
		if (parseInt(a[9].value) < parseInt(b[9].value)) return 1;
		else return -1;
		});
		
	
    d3.select("body").html(JSON.stringify(arr));
	});
	
}