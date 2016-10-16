var acled_sample = window.acled_sample || {};
acled_sample.api = (function () {

	var acled_nigeria_query_gist = 'https://gist.githubusercontent.com/mmoreno-cart/7491ff73517c4246988334e4dc273eef/raw/9e25fd7d87999762d4ba5b930fddbcac09266256/adled_api_nigeria_2016.json';
	var acled_sample_query_gist = 'https://gist.githubusercontent.com/mmoreno-cart/786e47863a984243f566ba64fdb27be6/raw/dbbda851fa13d7d98a70690a84b8d1859a5313fb/acled_api_sample_2016.json';
	var acled_all_query_gist = 'https://gist.githubusercontent.com/mmoreno-cart/3b61edab4fda2c8dceb705b42db103f9/raw/1bf03b9a1885e34038741c6e77ed316610f42b05/acled_api_2016.json';

	var api = {
				
		getAll: function() {
			return $.getJSON(acled_all_query_gist).then(function(data){
				return data;
			});
		},
		
		getCountries: function() {
			return $.getJSON(acled_all_query_gist).then(function(data){
				var country_list = [];
				data.data.forEach(function (d) {
					if (country_list.indexOf(d.country) == - 1) {
						country_list.push(d.country);
					}
				});
				return country_list;
			});
		},
		
		getEventsInCountry: function (country) {
			return $.getJSON(acled_all_query_gist).then(function(data){
				var event_list = [];
				data.data.forEach(function (d) {
					if (d.country == country) {
						event_list.push(d);
					}
				});
				return event_list;
			});
		}
		
	};

	return api;
}());