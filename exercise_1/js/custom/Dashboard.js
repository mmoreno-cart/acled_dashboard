/* DOM */
var dom = {
	chart1: $('#chart-1'),
	chart2: $('#chart-2'),
	chart3: $('#chart-3'),
	chart4: $('#chart-4'),
	chart5: $('#chart-5'),
	table: $('#table')
};

/* Crossfilter */
var cf;
var filterFromCode = false;

var charts = {};

// Load dashboard from received data
function initDashboard(data){
	
	// initMap IF IT DOES NOT EXIST
	
	
	/* Data adjustment */
	var clean_data = [];
	data.forEach(function (d) {
		//CHECK THAT WE HAVE COORDINATES
		
			//ADAPT NEEDED ATTRIBUTES
			
			
			clean_data.push(d);
		
	});

	/* Crossfilter config */
	cf = crossfilter(clean_data);
	
	// ADD DIMENSIONS (admin1 1, data_id, COORDINATES AND DATE)
	cf.dim = {};
	
	
	// ADD GROUPS (admin1 1, data_id, COORDINATES AND DATE)
	cf.grp = {};
	
	
	// GROUP ALL FOR TOTAL NUMBER OF FILTERED EVENTS

	
	// INIT CHARTS AND TABLE --> HTML ELEMENT


	// ADD admin1 CHART
	//height tip: calculateChartHeight(cf.grp.admin1.size(),10, 25, 40)
	
	
	// ADD DATE CHART
    
	
	// ADD dataCount INDICATOR IN filter-indicator

	
	// ADD TABLE
	
	
	// ADD EVENT TO TRIGGER WHEN FILTER BY CHART --> LINK WITH MAP
	for (var i = 0; i < dc.chartRegistry.list().length; i++) {
		var chartI = dc.chartRegistry.list()[i];
		chartI.on("filtered", function(chart, filter){ if (filterFromCode === false) { chartFiltered(); }});
	}
	
	//ADD ON moveend EVENT
	map.on("moveend", onmapmoveend);
	
	
	//RENDER POINTS ON MAP
	updateMapPoints();
	
	
	// FITBOUNDS (tip: timeout)
	setTimeout(function(){
		map.fitBounds(cluster_layer.getBounds());
	},1000);
	
	
	dc.renderAll();
	
}

// Function to calculate the height  of row charts
function calculateChartHeight(value_number, max_rows, row_height, gaps) {
	var n;
	var h;
	(value_number < max_rows) ? n=value_number : n=max_rows;
	h = n * row_height + gaps;
	return h;
}