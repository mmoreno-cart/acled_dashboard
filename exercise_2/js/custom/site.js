$(document).on('ready', function () {

	$('#country-selector').addClass('loading');
	var countries_ajax = acled_sample.api.getCountries();
	//var countries_ajax = ['Nigeria'];
	$.when(countries_ajax).then(function(countries) {
		$('#country-selector').removeClass('loading');
		countries.sort();
		countries.forEach(function(c){
			$('#country-selector').append("<option value=\"" + c + "\">" + c + "</option>");	
		});
	});
	
	$('#country-selector').on('change', function() {
		
		$('#loader-container').addClass('loading').show();
		//$('#dashboard-container').hide();
		
		var country = $('#country-selector').val();
		var events_ajax = acled_sample.api.getEventsInCountry(country);
		//var events_ajax = data;
		$.when(events_ajax).then(function(results) {
			
			$('#loader-container').removeClass('loading').hide();
			$('#dashboard-container').show();
			
			
			// Call data
			
			// HDX API: http://docs.humdata.org/an-api-for-ebola-data/
			var hdx_query = 'https://data.humdata.org/api/action/datastore_search?resource_id=a02903a9-022b-4047-bbb5-45127b591c85';
			
			// ACLED API: http://www.acleddata.com/data/acled-api/
			// http://acleddata.com/api/acled/read?year=2016&country=Nigeria
			var acled_query = 'http://acleddata.com/api/acled/read?year=2016&country=Nigeria&limit=0';
			var acled_query_gist = 'https://gist.githubusercontent.com/mmoreno-cart/7491ff73517c4246988334e4dc273eef/raw/9e25fd7d87999762d4ba5b930fddbcac09266256/adled_api_nigeria_2016.json';
			//var acled_query = "http://acleddata.com/api/acled/read";
			
			//$.getJSON("http://geonode.state.gov/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3ASyria_RefugeeSites_2016Jan21_HIU_DoS0&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature", function( data ) {
			//var dsv = d3.dsv(";", "text/plain");	
			//dsv("https://gist.githubusercontent.com/mmoreno-cart/374b4ceedab4fda4b7cb904075fa6ac7/raw/ab3514a02812845af03a04d2a7e2c01edcaf276e/RR_SOSA_ARABA_es_20160905.csv", function(data){
				
			//d3.json(acled_query_gist, function( results ) {
			
				//console.log(data);
				//debugger;
				
				initDashboard(results);
			//});
			
			/*var carto_query = 'https://mmoreno.carto.com/api/v2/sql?q=SELECT name,admin1 FROM responsibles_algeria';
			$.getJSON(carto_query, function(carto) {
				debugger;
				console.log(carto);
			})*/

		});

	});

});

