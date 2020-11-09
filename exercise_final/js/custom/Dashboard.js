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
	
	//console.log(data);
	/*data.data.forEach(function (d) {
		console.log(d.data_id,d.latitude,d.longitude);
	});*/
	
	if (!map){
		initMap('map');		
	}
	
	/* Data adjustment */
	var clean_data = [];
	data.forEach(function (d) {
		if (d.latitude && d.longitude) { //check that we have coordinates
			if (!d.event_type || d.event_type == '') {
				d.event_type = 'Not available';
			}
			if (!d.admin1 || d.admin1 == '') {
				d.admin1 = 'Not available';
			}
			if (!d.source || d.source == '') {
				d.source = 'Not available';
			}
			var parseTime = d3.timeParse('%Y-%m-%d'); // Format in which data come
			var event_date_split = d.event_date.split('-');
			d.event_date = (new Number(event_date_split[0]) + 2000) + '-' + event_date_split[1] + '-' + event_date_split[2];
			d.dd = parseTime(d.event_date);
			clean_data.push(d);
		}
	});

	/* Crossfilter config */
	cf = crossfilter(clean_data);
	
	// Dimensions
	cf.dim = {};
	cf.dim.event_type = cf.dimension(function(d){ return d.event_type; });
	cf.dim.admin1 = cf.dimension(function(d){ return d.admin1; });
	cf.dim.data_id = cf.dimension(function(d){ return d.data_id; });
	cf.dim.latitude = cf.dimension(function(d){ return +d.latitude; });
	cf.dim.longitude = cf.dimension(function(d){ return +d.longitude; });
	cf.dim.dd = cf.dimension(function (d) { return d.dd; });
	
	// Groups
	cf.grp = {};
	cf.grp.event_type = cf.dim.event_type.group();
	cf.grp.admin1 = cf.dim.admin1.group().reduceSum(function(d) { return d.fatalities; });
	cf.grp.data_id = cf.dim.data_id.group();
	cf.grp.latitude = cf.dim.latitude.group();
	cf.grp.longitude = cf.dim.longitude.group();
	cf.grp.dd_COUNT = cf.dim.dd.group().reduceSum(function(d) { return d.fatalities; });//.reduceCount();

	cf.grp.all = cf.groupAll();
	
	/* Charts */
	charts.admin1 = new dc.RowChart('#chart-1');
	charts.event_type = new dc.PieChart('#chart-2');
	charts.event_date = new dc.BarChart('#chart-5');
	charts.Table = new dc.DataTable('.dc-data-table');

	$(dom.chart1).html('<h4>1st admin level (Top 10)</h4>');
	charts.admin1
		.width(250)
		.height(calculateChartHeight(cf.grp.admin1.size(),10, 25, 40))//
		.dimension(cf.dim.admin1)
		.group(cf.grp.admin1)
		.elasticX(true)
		.data(function(group) {	return group.top(10); })
		.colors(['#6DDC7A'])
		.colorAccessor(function(d, i){ return 0;})
		.xAxis().ticks(3);//.tickFormat(d3.format("g"));
	
	$(dom.chart2).html('<h4>Event type</h4>');
	charts.event_type
        .dimension(cf.dim.event_type)
        .group(cf.grp.event_type)
        .width(180)
        .height(180)
        .radius(80)
        .innerRadius(30);
	
	// Date chart
    charts.event_date.width(1000)
        .height(120)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(cf.dim.dd)
        .group(cf.grp.dd_COUNT)
        .centerBar(true)
        .gap(1)
        .x(d3.scaleTime().domain([new Date(2016, 0, 1), new Date(2017, 0, 1)]))
		.yAxis().ticks(3);
		
	dc.dataCount("#filter-indicator")
		.dimension(cf)
		.group(cf.grp.all);
	
	charts.Table
        .dimension(cf.dim.event_type)
        // Data table does not use crossfilter group but rather a closure
        // as a grouping function
        .group(function (d) {
			return d.event_type;
        })
        // (_optional_) max number of records to be shown, `default = 25`
        .size(cf.grp.data_id.size())
        // There are several ways to specify the columns; see the data-table documentation.
        // This code demonstrates generating the column header automatically based on the columns.
        .columns([			
			function(d) {
				return d.location;
			},
			function(d) {
				return d.admin1;
			},
			function(d) {
				return d.fatalities;
			}
		])
        // (_optional_) sort using the given field, `default = function(d){return d;}`
        .sortBy(function (d) {
            return d.location;
        })
        // (_optional_) sort order, `default = d3.ascending`
        .order(d3.ascending)
        // (_optional_) custom renderlet to post-process chart using [D3](http://d3js.org)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });
	
	for (var i = 0; i < dc.chartRegistry.list().length; i++) {
		var chartI = dc.chartRegistry.list()[i];
		chartI.on("filtered", function(chart, filter){ if (filterFromCode === false) { chartFiltered(); }});
	}
	
	map.on("moveend", onmapmoveend);
	
	updateMapPoints();
	
	setTimeout(function(){
		map.fitBounds(cluster_layer.getBounds());
	},1000);
	
	
	//geofilter();
	dc.renderAll();
	//filterFromCode = false;
	
}

// Function to calculate the height  of row charts
function calculateChartHeight(value_number, max_rows, row_height, gaps) {
	var n;
	var h;
	(value_number < max_rows) ? n=value_number : n=max_rows;
	h = n * row_height + gaps;
	return h;
}