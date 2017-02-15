// Store the location of 5 places of our choice.
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

// var markersPosition = [10, 20, 30, 40, 50];

// Define global variables for the map and infoWindows.
var map, locationsInfoWindow, service;
// Coordinates of the mao center
var cityOfCagliari = {
				lat: 39.2151,
				lng: 9.1128
			};
// Create an array to hold the markers.
var markers = [];

// var elem;


// Create a custom binding handler to interact with the
// Google Maps API.
ko.bindingHandlers.map = {
	// Define an 'init' callback to be called once for the DOM
	// element the callback is used on (in this case, the div with
	// id='map').
	init: function(element, valueAccessor) {
		// Assign to a variable data the current model property that
		// is involved in this binding, in this case 'position'.
		// Do this by calling the function parameter 'valueAccessor()',
		// a JavaScript function that gets the current model property
		// plain value.
		var value = ko.unwrap(valueAccessor());

		// Create a new map JavaScript object using the coordinates
		// given by the center position property of the ViewModel.
		map = new google.maps.Map(element, {
			zoom: 15,
			center: cityOfCagliari
			// center: {
			// 	lat: 39.2151,
			// 	lng: 9.1128
			// }
		});

		var request = {
			location: cityOfCagliari,
			// location: {
			// 	lat: 39.2151,
			// 	lng: 9.1128
			// },
			radius: 500,
			// query: value
			query: 'restaurant'
		};

		console.log(value);
		console.log(request.query);

		service = new google.maps.places.PlacesService(map);
		service.textSearch(request, callback);

		function callback(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					console.log(place.name);
					addMarker(place);
				}
			}
		}

		function addMarker(place) {
			console.log(place.name);
			var title = place.name

			// Create a marker for each place and insert it into the markers array
			markers.push(new google.maps.Marker({
				// The position field of the Marker options object literal
				// taken by the google.maps.Marker constructor specifies a
				// LatLng identifying the location of the marker.
				position: place.geometry.location,
				// The map field specifies the Map on which to place the
				// marker; here the marker is attached to the map created
				// just above.
				map: map,
				// title: title
				// title: 'Marker'  //place.name
			}));



			// var marker = new google.maps.Marker({
			// 	// The position field of the Marker options object literal
			// 	// taken by the google.maps.Marker constructor specifies a
			// 	// LatLng identifying the location of the marker.
			// 	position: place.geometry.location,
			// 	// The map field specifies the Map on which to place the
			// 	// marker; here the marker is attached to the map created
			// 	// just above.
			// 	map: map,
			// 	// title: title
			// 	// title: 'Marker'  //place.name
			// });


		}
	},

	update: function(element, valueAccessor) {
		var value = String(ko.unwrap(valueAccessor()));

		var request = {
			location: cityOfCagliari,
			// location: {
			// 	lat: 39.2151,
			// 	lng: 9.1128
			// },
			radius: 500,
			query: value
			// query: 'restaurant'
		};

		console.log(typeof(value));
		console.log(typeof(request.query));

		service = new google.maps.places.PlacesService(map);
		service.textSearch(request, callback);

		function callback(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				// Clear out the old markers.
				markers.forEach(function(marker) {
					marker.setMap(null);
				});
				markers = [];

				var elem = document.getElementById('input-list');
				while (elem.firstChild) {
					elem.removeChild(elem.firstChild);
				}

				// if (uList) {
				// 	elem.removeChild(uList);
				// }

				var uList = document.createElement('ul');

				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					console.log(place.name);
					// addMarker(results[i]);
					addMarker(place);

					// var marker = new google.maps.Marker({
					// 	// The position field of the Marker options object literal
					// 	// taken by the google.maps.Marker constructor specifies a
					// 	// LatLng identifying the location of the marker.
					// 	position: place.geometry.location,
					// 	// The map field specifies the Map on which to place the
					// 	// marker; here the marker is attached to the map created
					// 	// just above.
					// 	map: map,
					// 	title: place.name
					// 	// title: 'Marker'
					// });

					var listItem = document.createElement('li');
					var newContent = document.createTextNode(place.name);
					listItem.appendChild(newContent);
					uList.appendChild(listItem);
				}

				// // Append the unordered list to the element the binding is applied to.
				// var elem = document.getElementById('input-list');
				// elem = document.getElementById('input-list');
				elem.appendChild(uList);
			}
		}

		function addMarker(place) {
			console.log(place.name);
			var title = place.name;



			// Create a marker for each place and insert it into the markers array
			markers.push(new google.maps.Marker({
				// The position field of the Marker options object literal
				// taken by the google.maps.Marker constructor specifies a
				// LatLng identifying the location of the marker.
				position: place.geometry.location,
				// The map field specifies the Map on which to place the
				// marker; here the marker is attached to the map created
				// just above.
				map: map,
				// title: title
				// title: 'Marker'  //place.name
			}));


			// var marker = new google.maps.Marker({
			// 	// The position field of the Marker options object literal
			// 	// taken by the google.maps.Marker constructor specifies a
			// 	// LatLng identifying the location of the marker.
			// 	position: place.geometry.location,
			// 	// The map field specifies the Map on which to place the
			// 	// marker; here the marker is attached to the map created
			// 	// just above.
			// 	map: map,
			// 	// title: title
			// 	title: 'Marker'
			// });
		}


		// 		results.forEach(function(queryResult) {
		// 			markersPosition.push(queryResult);
		// 		});

		// 		for(var i = 0; i < markersPosition.length; i++) {
		// 			console.log(markersPosition[i].geometry.location.lat);
		// 			var marker = new google.maps.Marker({
		// 				// The position field of the Marker options object literal
		// 				// taken by the google.maps.Marker constructor specifies a
		// 				// LatLng identifying the location of the marker.
		// 				position: markersPosition[i].geometry.location,
		// 				// The map field specifies the Map on which to place the
		// 				// marker; here the marker is attached to the map created
		// 				// just above.
		// 				map: map,
		// 				title: 'Marker ' + (i + 1)
		// 			});
		// }
	}







	// 	// console.log(data);
	// 	// Add a marker to the map for each given location.
	// 	for(var i = 0; i < data.length; i++) {
	// 		var marker = new google.maps.Marker({
	// 			// The position field of the Marker options object literal
	// 			// taken by the google.maps.Marker constructor specifies a
	// 			// LatLng identifying the location of the marker.
	// 			position: data[i],
	// 			// The map field specifies the Map on which to place the
	// 			// marker; here the marker is attached to the map created
	// 			// just above.
	// 			map: map,
	// 			title: 'Marker ' + (i + 1)
	// 		});
	// 		console.log(data[i]);
	// 	}
	// }


	// 	var request = {
	// 		location: data.center,
	// 		radius: 500,
	// 		query: data.markers[i]
	// 		// query: 'restaurant'
	// 	};











		// service = new google.maps.places.PlacesService(map);
		// service.textSearch(request, callback);

		// function callback(results, status) {
		// 	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// 		results.forEach(function(queryResult) {
		// 			markersPosition.push(queryResult);
		// 		});

		// 		for(var i = 0; i < markersPosition.length; i++) {
		// 			console.log(markersPosition[i].geometry.location.lat);
		// 			var marker = new google.maps.Marker({
		// 				// The position field of the Marker options object literal
		// 				// taken by the google.maps.Marker constructor specifies a
		// 				// LatLng identifying the location of the marker.
		// 				position: markersPosition[i].geometry.location,
		// 				// The map field specifies the Map on which to place the
		// 				// marker; here the marker is attached to the map created
		// 				// just above.
		// 				map: map,
		// 				title: 'Marker ' + (i + 1)
		// 			});
		// 	// Add an event listener so that the infoWindow only opens
		// 	// when we click on the marker.
		// 	// Code taken from the Google Maps API section of the course.
		// 	marker.addListener('click', function() {
		// 		populateInfoWindow(this, locationsInfoWindow);
		// 	});
		// }



				// for(var i = 0; i < results.length; i++) {
				// 	var place = results[i];
				// 	var marker = new google.maps.Marker({
				// 		// The position field of the Marker options object literal
				// 		// taken by the google.maps.Marker constructor specifies a
				// 		// LatLng identifying the location of the marker.
				// 		position: place.geometry.location,

				// 		//data.markers[i],
				// 		// The map field specifies the Map on which to place the
				// 		// marker; here the marker is attached to the map created
				// 		// just above.
				// 		map: map,
				// 		// title: 'Marker ' + (i + 1)
				// 	});
				// }
			// }
			// console.log(markersPosition[0]);
			// console.log(data);



		// // Create an infoWindow instance.
		// locationsInfoWindow = new google.maps.InfoWindow();

		// // Make an AJAX request to the Wikipedia API for articles about selected locations.
		// var locationString = 'Cagliari';
		// // Define the wikipedia article link that will be appended to the infoWindow.
		// var wikiAPIStr;
		// // Store the Wikipedia URL with a search string.
		// // Code taken from the Wikipedia API lesson of the course.
		// var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
		// 	locationString + '&format=json&callback=wikiCallback';
		// // AJAX request object.
		// $.ajax({
		// 	url: wikiUrl,
		// 	dataType: 'jsonp',
		// 	success: function(response) {
		// 		// The articleList variable is set equal to the array of articles
		// 		// from the response.
		// 		var articleList = response[1];
		// 		// Take only the first article, that should be the most relevant.
		// 		var selectedArticle = articleList[0];
		// 		// Create the url to load the page when the link is clicked.
		// 		var articleUrl = 'https://en.wikipedia.org/wiki/' + selectedArticle;
		// 		// Set the Wikipedia article link.
		// 		wikiAPIStr = '<p><a href="' + articleUrl + '" target="_blank">' +
		// 			selectedArticle + '</a></p>';
		// 	}
		// });

		// // Add a marker to the map for each given location.
		// for(var i = 0; i < data.length; i++) {
		// 	var marker = new google.maps.Marker({
		// 		// The position field of the Marker options object literal
		// 		// taken by the google.maps.Marker constructor specifies a
		// 		// LatLng identifying the location of the marker.
		// 		position: data[i],
		// 		// The map field specifies the Map on which to place the
		// 		// marker; here the marker is attached to the map created
		// 		// just above.
		// 		map: map,
		// 		title: 'Marker ' + (i + 1)
		// 	});
		// 	// Add an event listener so that the infoWindow only opens
		// 	// when we click on the marker.
		// 	// Code taken from the Google Maps API section of the course.
		// 	marker.addListener('click', function() {
		// 		populateInfoWindow(this, locationsInfoWindow);
		// 	});
		}

		// Tell the infoWindow to open at this marker and populate it with
		// information specific to this marker.
		// Code taken from the Google Maps API section of the course.
		function populateInfoWindow(marker, infowindow) {
			// Check to make sure the infoWindow is not already open on this marker.
			if (infowindow.marker != marker) {
				infowindow.marker = marker;
				// Set the infoWindow content to contain a title and a Wikipedia link.
				var content = '<div class="location-info"><div>' + marker.title + '</div>' +
					'<div>' + wikiAPIStr + '</div></div>'
				// infowindow.setContent('<div>' + marker.title + '</div>');
				infowindow.setContent(content);
				infowindow.open(map, marker);
				// Make sure the marker property is cleared if the infoWindow is closed.
				infowindow.addListener('closeclick', function() {
					infowindow.setMarker = null;
				});
			}
		};
	// }
// };

// Create a custom binding handler to interact with the
// input filter and list of places.
ko.bindingHandlers.inputList = {
	// Define an 'init' callback to be called once for the DOM
	// element the callback is used on (in this case, the div with
	// id='input-list').
	init: function(element, valueAccessor) {
		// Assign to a variable data the current model property that
		// is involved in this binding, in this case 'myLocations'.
		// Do this by calling the function parameter 'valueAccessor()',
		// a JavaScript function that gets the current model property
		// plain value.
		var data = valueAccessor();
		// Create an unordered list element and assign its reference to
		// a variable.
		var uList = document.createElement('ul');
		// Create as many list items elements as the length of the
		// 'markersPosition' array, assign a text content to each of them
		// and append them to the unordered list.
		for (var i = 0; i < data.listItems.length; i++) {
			var listItem = document.createElement('li');
			var newContent = document.createTextNode(data.listItems[i].lat);
			listItem.appendChild(newContent);
			uList.appendChild(listItem);
		}

		// Append the unordered list to the element the binding is applied to.
		element.appendChild(uList);
	}
};

// Instantiate the ViewModels and activate KnockoutJS inside a callback function.
// This makes sure that the Google Maps API has finished loading before we use
// this script that depends on the Google Maps API.
//
// Suggestion taken from a response in the discussion forum:
// https://discussions.udacity.com/t/map-async-moved-after-app-js/216797/2
function activateKO() {
	// The ViewModel contains a property for the positions of the map
	// center and the markers on the map.
	var ListViewModel = function() {
		var self = this;
		// Store the map center and markers positions.
		// self.position = {
		// 	center: {
		// 		lat: 39.2151,
		// 		lng: 9.1128
		// 	},
		// 	markers: []
		// };
		self.position = {
			center: {
				lat: 39.2151,
				lng: 9.1128
			}
			// markers: []
		};

		self.query = ko.observable();
		self.filterSearch = function() {
			self.query(self.query());
		};
	};

	var MapViewModel = function() {
		var self = this;
		// Store the map center and markers positions.
		self.position = {
			center: {
				lat: 39.2151,
				lng: 9.1128
			},
			// markers: []
		};
	};


	// map = new google.maps.Map(document.getElementById('map'), {
	// 		zoom: 15,
	// 		// center: data.center
	// 		center: {
	// 			lat: 39.2151,
	// 			lng: 9.1128
	// 		}
	// 	});



		// ************************************

		// self.markers = ko.observableArray();
		// markersPosition.forEach(function(positionItem) {
		// 	self.markers.push(positionItem);
		// });
		// self.newLocation = ko.observable("");

		// self.addLocation = function() {
		// 	if(self.newLocation != "") {
		// 		// console.log( self.newLocation() );
		// 		self.markers.push(self.newLocation());
		// 	}
		// 	self.newLocation("");
		// };

		// ************************************










		// // Populate the 'markers' array property in the position field with
		// // the locations selected by the user.
		// self.hasLocations = ko.computed({
		// 	read: function()
		// 	{
		// 		markersPosition.forEach(function(positionItem) {
		// 			self.position['markers'].push(positionItem);
		// 		});
		// 	},
		// 	deferEvaluation: true
		// }, self);
		// // markersPosition.forEach(function(positionItem) {
		// // 	self.position['markers'].push(positionItem);
		// // });
	// };

	// var ListViewModel = function() {
	// 	var self = this;
	// 	// Store the coordinates of the places we chose.
	// 	self.myLocations = {
	// 		listItems: []
	// 	};

	// 	// Populate the 'markers' array property in the position field with
	// 	// the locations selected by the user.
	// 	markersPosition.forEach(function(positionItem) {
	// 		self.myLocations['listItems'].push(positionItem);
	// 	});

	// 	function doSomething() {
	// 		console.log("Ciao");
	// 	}
	// };

	// Apply the bindings to activate Knockout JS with distinct view models
	// against separate DOM elements.
	//
	// See the following question on Stackoverflow: http://stackoverflow.com/
	// questions/8676988/example-of-knockoutjs-pattern-for-multi-view-applications/
	// 8680668#8680668
	// ko.applyBindings(new MapViewModel(), document.getElementById('map'));
	// ko.applyBindings(new ListViewModel(), document.getElementById('input-list'));


	// Store the DOM element with id='input-list' in a variable.
	// var elem = document.getElementById('input-list');
	// console.log(elem);

	ko.applyBindings(new ListViewModel());
}

