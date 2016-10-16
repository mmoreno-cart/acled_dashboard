
// Triggered when filtering through a chart --> updates map points
function chartFiltered() {
	filterFromCode = true;
	
	dc.events.trigger(function () {
		//geofilter();
		updateMapPoints(); // refresh map
	});

	filterFromCode = false;
}

// Loads points to the map in function of the filters
function updateMapPoints() {
	filterFromCode = true;
	//debugger;
	//remove all markers from the map in order to be able to do a refresh
	cluster_layer.clearLayers();
	
	
	if (!map.hasLayer(cluster_layer)) return;
	map.removeLayer(cluster_layer);
	
	var marker_list = [];
	
	cf.dim.data_id.top(Infinity).forEach(function(p, i) {

		if (!p["latitude"] || !p["longitude"] ) {
			return;
		}

		var marker = L.marker([p.latitude,p.longitude], {icon: new L.Icon.Default()}); // in lat-long
		marker.on('mouseover',function (e) {
			info.addTo(map);
			info.update(p.location);
		});
		marker.on('mouseout',function (e) {
			info.update();
			info.removeFrom(map);
		});
		//on click, show the specific project
		marker.on('click',function () {
			var attr = p;
			return function() {
				//showProjectDetails(attr); //showModal
			}
		}());
		
		marker_list.push(marker);
		
		//add the marker to the map
		cluster_layer.addLayer(marker);
	});
	
	map.addLayer(cluster_layer);
	filterFromCode = false;
}

function onmapmoveend() {
	filterFromCode = true;
	if (map.hasLayer(cluster_layer)) {
		geofilter();
		dc.redrawAll();
	}
	filterFromCode = false;
}

// Function to filter by map extension
function geofilter() {
	filterFromCode = true;

	cf.dim.latitude.filter(null);
	cf.dim.longitude.filter(null);
	
	if (map.hasLayer(cluster_layer)) {
		var bounds = map.getBounds();
		var lat = [bounds.getNorthEast()["lat"], bounds.getSouthWest()["lat"]];
		var lng = [bounds.getNorthEast()["lng"], bounds.getSouthWest()["lng"]];
		lat = lat[0] < lat[1] ? lat : [lat[1], lat[0]];
		lng = lng[0] < lng[1] ? lng : [lng[1], lng[0]];
		cf.dim.latitude.filter(lat);
		cf.dim.longitude.filter(lng);
	}
	filterFromCode = false;
};