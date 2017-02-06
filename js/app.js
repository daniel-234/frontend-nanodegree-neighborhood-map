// Store the location of 5 places
var markersPosition = [
	{
		lat: 39.2146448,
		lng: 9.1125939
	}, {
		lat: 39.2141012,
		lng: 9.1140706
	}, {
		lat: 39.2139655,
		lng: 9.1138612
	}, {
		lat: 39.2145392,
		lng: 9.1132458
	}, {
		lat: 39.2128275,
		lng: 9.1150288
	}
];

// Create a custom binding handler to interact with the
// Google Maps API
ko.bindingHandlers.map = {
	// Define an 'init' callback to be called once for the DOM
	// element the callback is used on (in this case, the div with
	// id='map')
	init: function(element, valueAccessor) {
		// Assign to a variable data the current model property that
		// is involved in this binding, in this case 'position'.
		// Do this by calling the function parameter 'valueAccessor()',
		// a JavaScript function that gets the current model property
		// plain value.
		var data = valueAccessor();

		// Create a new map JavaScript object using the coordinates
		// given by the position property of the ViewModel.
		map = new google.maps.Map(element, {
			zoom: 15,
			center: data.center
		});

		// Add a marker to the map for each selected location
		for(var i = 0; i < data.markers.length; i++) {
			var marker = new google.maps.Marker({
				// The position field of the Marker options object literal
				// taken by the google.maps.Marker constructor specifies a
				// LatLng identifying the location of the marker.
				position: data.markers[i],
				// The map field specifies the Map on which to place the
				// marker; here the marker is attached to the map created
				// just above.
				map: map,
				title: 'Marker ' + (i + 1)
			});
		}
	}
};

// The ViewModel contains a property for the positions of the map
// center and the markers on the map.
var ViewModel = function() {
	var self = this;
	// Store the map center and markers positions.
	self.position = {
		center: {
			lat: 39.2151,
			lng: 9.1128
		},
		markers: [
			// {
			// 	lat: 39.214645,
			// 	lng: 9.112594
			// }
		]
	};

	// Populate the 'markers' array property in the position field with
	// the locations selected by the user.
	markersPosition.forEach(function(positionItem) {
		self.position['markers'].push(positionItem);
	});
};

// Apply the binding to activate Knockout JS when the HTML document
// is ready.
$(document).ready(function() {
	ko.applyBindings(new ViewModel());
});
