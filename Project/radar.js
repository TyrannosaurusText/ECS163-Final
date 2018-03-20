// Config for the Radar chart
var defaultconfig = {
    w: 300,
    h: 300,
    maxValue: 835,
    levels: 6,
    ExtraWidthX: 300,
    color: d3.scaleOrdinal().range(["#6F257F", "#6AC6FF", "#1AC6FF"])
}
radar( ".radar",["LOT 1", "LOT 5", "LOT 10", "LOT 2"], ["A", "C", "METER"])
// Example call: radar( ".radarChart",["LOT 1", "LOT 2", "LOT 3", "LOT 4"], ["A", "C", "METER"])
//Call function to draw the Radar chart
function radar(id, lots, permits=["A","C","DISABLED","METER","TIMEZONE","CARPOOL","ELECTRIC","RESTRICTED","MOTORCYCLE","TOTAL"],config=defaultconfig)
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