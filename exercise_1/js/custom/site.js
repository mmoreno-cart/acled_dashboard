$(document).on('ready', function () {

	// LOAD AVAILABLE COUNTRIES WITH acled_sample.api
	
	
	// ADD ON CHANGE EVENT TO COUNTRY SELECTOR --> initDashboard
	$('#country-selector').on('change', function() {
		
		$('#dashboard-container').show();
		

	});

});

