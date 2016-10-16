/* Map */
var map;
var cluster_layer;
var info;

// load map
function initMap(idmap){
	
	// Basemaps
	var OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
	});
	var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		subdomains: 'abcd',
		maxZoom: 19
	});
	var basemaps = {
		'HOT': OpenStreetMap_HOT,
		'Light': CartoDB_Positron,
	};
	
	// Map definition
	map = L.map(idmap,{
		center: [20, 0], // y,x
		zoom: 1,
		maxZoom:16,
		minZoom:1,
		layers: [OpenStreetMap_HOT],
		attributionControl: true
	});
	
	// Cluster layer for events (empty at the start)
	cluster_layer = L.markerClusterGroup({
		showCoverageOnHover		: false,
		maxClusterRadius		: 45,
		//disableClusteringAtZoom	: 8,
		spiderfyOnMaxZoom		: true
	});
	var overlays = {
		"ACLED events": cluster_layer,
	};
	map.addLayer(cluster_layer);
	
	L.control.layers(basemaps, overlays).addTo(map);
	
	// control that shows the location of the event on hover
	info = L.control({ position: 'bottomleft'});
	info.onAdd = function (map) {
		if ($('.info').length < 1) {
			this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		}		
		this.update();
		return this._div;
	};
	info.update = function (title) {
		this._div.innerHTML = (title ?
			'<b>' + title + '</b>'
			: 'Hover over an event');
	};
	
}