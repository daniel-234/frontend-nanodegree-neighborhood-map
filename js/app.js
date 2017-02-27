// Define global variables for the map and infoWindows instances.
var map, locationsInfoWindow, service, bounds;
// Store the map center coordinates and set them to the city center
// of Cagliari, the capital town of Sardinia (IT).
var cityOfCagliari = {
				lat: 39.2151,
				lng: 9.1128
			};

var mapDiv = document.getElementById('map');
// Create an array to hold the markers.
var markers = [];
// var places = [];

// Create an array with 6 locations to be displayed by default when the page loads.
var places = [
	{
		name: 'Cagliari Cathedral',
		geometry: {
			location: {
				lat: 39.2187433,
				lng: 9.116967899999963
			}
		}
	},
	{
		name: 'Bastione di Saint Remy',
		geometry: {
			location: {
				lat: 39.2159691,
				lng: 9.11647040
			}
		}
	},
	{
		name: 'Torre dell\'Elefante',
		geometry: {
			location: {
				lat: 39.21794610,
				lng: 9.114884099999927
			}
		}
	},
	{
		name: 'ExMà',
		geometry: {
			location: {
				lat: 39.2147617,
				lng: 9.120505800000046
			}
		}
	},
	{
		name: 'Piazza Matteotti',
		geometry: {
			location: {
				lat: 39.21510099999999,
				lng: 9.108989899999983
			}
		}
	},
	{
		name: 'Pinacoteca Nazionale Cagliari',
		geometry: {
			location: {
				lat: 39.22297289999999,
				lng: 9.117204000000015
			}
		}
	}
];

// Store the position of the selected marker; undefined as page loads.
// As a marker is clicked, it stores its position inside the markers
// array; it is called to set the icon back to the original color when
// another marker is clicked.
var selectedMarker;

// Store the map icon markers.
var greenIcon = 'img/green_marker.png';
var redIcon = 'img/red_marker.png';

// Create a map object and populate it with the result of the SearchBox
// autocomplete input field.
// As the app loads, populate it with results from localStorage.
function initMap() {
	// Create a new map JavaScript object using the coordinates
	// given by the center property.
	map = new google.maps.Map(mapDiv, {
		zoom: 15,
		center: cityOfCagliari
	});

	console.log(places instanceof Array);

	// Update the observable array.
	viewModel.locations(places);

	// Create a bounds object.
	bounds = new google.maps.LatLngBounds();

	// Create an infoWindow instance.
	locationsInfoWindow = new google.maps.InfoWindow();

	// Place the markers in the map.
	placeMarkers(places);

	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	// Listen for the event fired when the user selects a prediction
	// and retrieve more details for that place.
	searchBox.addListener('places_changed', function() {
		places = searchBox.getPlaces();

		// Update the observable array.
		viewModel.locations(places);

		if (places.length == 0) {
			console.log('No selection has been made.');
			return;
		}

		// Clear out the old markers
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

		// Place the markers in the map.
		placeMarkers(places);
	});

	map.fitBounds(bounds);
}

// Place the markers in the map at the returned places.
function placeMarkers(places) {
	// For each result, place a marker in the map and add a list item.
	for (var i = 0; i < places.length; i++) {
		// Store the result.
		var place = places[i];
		if(!place.geometry) {
			console.log('Returned place contains no geometry');
			return;
		}

		// Add a new marker and a list item to the map.
		addMarker(place, i);


		if (place.geometry.viewport) {
			// Only geocodes have viewport
			bounds.union(place.geometry.viewport);
		} else {
			bounds.extend(place.geometry.location);
		}
	}
}

// Create a marker with an infoWindow and insert it into the 'markers' array.
// Create a list item connected to an appropriate marker.
function addMarker(place, listPos) {
	// Store the marker title.
	var title = place.name;
	// Define a variable to store the Wikipedia repsonse link.
	var wikiAPIStr;
	// Create a new marker for each place.
	var marker = new google.maps.Marker({
		// The position field of the Marker options object literal
		// taken by the google.maps.Marker constructor specifies a
		// LatLng identifying the location of the marker.
		position: place.geometry.location,
		// The map field specifies the Map on which to place the
		// marker; here the marker is attached to the map created
		// just above.
		map: map,
		title: title
	});

	// Store the place name.
	var locationString = place.name;
	// Compose the Wikipedia URL search string with the search term. Query the Wikipedia
	// Code taken from the Wikipedia API lesson of the course.
	// Query the English Wikipedia API; to query the Italian API, change 'en' to 'it'.
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
		locationString + '&format=json&callback=wikiCallback';

	// AJAX request object.
	$.ajax({
		url: wikiUrl,
		dataType: 'jsonp',
		success: function(response) {
			console.log(response);
			// Take the first element of the response Array as the article title.
			var articleTitle = response[0];
			// There may be more than one article in the response's 4th element. Take only the first link,
			// that should be the most representative.
			var articleUrl = response[3][0];
			// The AJAX response is an Array with 4 elements. The Wikipedia link that's of interest to the
			// marker infoWindow is stored at position 3 (of a 0-based array).
			// If the response array has a 4th element, compose the link; otherwise, provide a standard
			// replacement message.
			if (response[3].length > 0) {
				wikiAPIStr = '<p><a href="' + articleUrl + '" target="_blank">' + articleTitle + '</a></p>';
			} else {
				wikiAPIStr = '<p>No results were found on Wikipedia.</p>';
			}
		},
		// Handle error if the AJAX method fails to load the API.
		error: function(parsedjson, textStatus, errorThrown) {
			// Display the error message on the console to let the user have more details about it.
			console.log('parsedJSON: ' + parsedjson.statusText + ' ' + parsedjson.status);
			console.log('Error status: ' + textStatus);
			console.log('Error thrown: ' + textStatus);
			console.log('parsedJSON: ' + JSON.stringify(parsedjson));
			// Display a string prompting the user to check the console for details.
			wikiAPIStr = '<p>There was an error loading the Wikipedia API.' + '<br />' + 'Chech the console for details.</p>';
		}
	});

	// Add an event listener to the marker.
	// Code taken from the Google Maps API section of the course and elaborated for this
	// app.
	marker.addListener('click', function() {
		// Set background color of the list item, the color of the marker and populates
		// the infoWindow.


		// selectRightLocation(this, listItem, locationsInfoWindow, wikiAPIStr);


		selectRightLocation(this, listPos, locationsInfoWindow, wikiAPIStr);
	});

	// Insert the marker into the markers array.
	markers.push(marker);

	// // Add an event listener to the list element.
	// listItem.addEventListener('click', function() {
	// 	// Set background color of the list item, the color of the marker and populates
	// 	// the infoWindow.
	// 	selectRightLocation(marker, this, locationsInfoWindow, wikiAPIStr);
	// });
}





// Tell the infoWindow to open at this marker and populate it with
// information specific to this marker.
// Code taken from the Google Maps API section of the course.
function populateInfoWindow(marker, infowindow, wikiAPIStr, itemPosition) {
	// Check to make sure the infoWindow is not already open on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		// Store the marker title and a Wikipedia link.
		var content = '<div class="location-info"><div>' + marker.title + '</div>' +
			'<div>' + wikiAPIStr + '</div></div>';
		// Set the infoWindow content.
		infowindow.setContent(content);
		infowindow.open(map, marker);
		// Set the icon of the marker to green as the infowindow opens.
		marker.setIcon(greenIcon);
		// Highlight the background color of the correspondent list item.
		// setListItemBackground(itemPosition, 'limegreen');
		// Make sure the marker property is cleared if the infoWindow is closed.
		infowindow.addListener('closeclick', function() {
			// Close the infoWindow on this marker.
			infowindow.marker = null;
			// Set the icon of the marker back to red as we close the infoWindow.
			marker.setIcon(redIcon);
			// Set the background color of the correspondent list item to normal.
			// setListItemBackground(itemPosition, 'white');
		});
	}
}

// Set the background color of the list item at position itemPos to color.
function setListItemBackground(itemPos, color) {
	document.getElementById("item_list" + itemPos).style.backgroundColor = color;
}


// Set the background color of the selected item and the color of the equivalent marker.
// Populate the appropriate infoWindow.
function selectRightLocation(marker, itemPos, locationsInfoWindow, wikiAPIStr) {
	// Store the position of the selected list item, taking it from its id.
	var itemNumber = itemPos;
	// Check if there is a marker already selected; if there is one, deselect it.
	// Retrieve it from the array, set back its icon to the normal red icon and
	// set the background color of the equivalent list element to normal.
	if ((itemNumber !== selectedMarker) && (selectedMarker !== undefined)) {
		markers[selectedMarker].setIcon(redIcon);
		// setListItemBackground(selectedMarker, 'white');
	}
	// Assign the current item position inside the markers array
	// to variable 'selectedMarker'.
	selectedMarker = itemNumber;
	// Call a function to higlight the selected list item and the equivalent marker and
	// populate the chosen marker's infoWindow..
	populateInfoWindow(marker, locationsInfoWindow, wikiAPIStr, itemNumber);
}



// // Set the background color of the selected item and the color of the equivalent marker.
// // Populate the appropriate infoWindow.
// function selectRightLocation1(marker, listItem, locationsInfoWindow, wikiAPIStr) {
// 	// Store the position of the selected list item, taking it from its id.
// 	var itemNumber = listItem.id.substr(9);
// 	// Check if there is a marker already selected; if there is
// 	// one, deselect it.
// 	// Retrieve it from the array, set back its icon to the normal red icon and
// 	// set the background color of the equivalent list element to normal.
// 	if ((itemNumber !== selectedMarker) && (selectedMarker !== undefined)) {
// 		markers[selectedMarker].setIcon(redIcon);
// 		setListItemBackground(selectedMarker, 'white');
// 	}
// 	// Assign the current item position inside the markers array
// 	// to variable 'selectedMarker'.
// 	selectedMarker = itemNumber;
// 	// Call a function to higlight the selected list item and the equivalent marker and
// 	// populate the chosen marker's infoWindow..
// 	populateInfoWindow(marker, locationsInfoWindow, wikiAPIStr, itemNumber);
// }





// Display an error message to the user if the map fails to load.
function googleError() {
	var message = document.createElement('p');
	message.classList.add('error-message');
	message.innerHTML = 'Something went wrong when loading Google Maps.' + '<br />' +
		'Check the JavaScript console for details.';
	var mapDiv = document.getElementById('map');
	mapDiv.append(message);
}

// Knockout ViewModel.
//
// Store the locations as an observable array inside the ViewModel..
function locationsViewModel() {
	var self = this;
	self.filter = ko.observable('');
	self.locations = ko.observableArray(places || []);

	// Provide a filter functionality that should filter (show or hide) the
	// existing list of locations as well as markers on the map.
	// It returns the matching subset of the original array of items.
	//
	// Building this functionality has forced me to face localStorage behavior
	// when storing JSON objects within an array.
	// The parsed object is in fact an array, however each JSON object in the
	// array is no longer an object and must be JSON parsed to "recreate" an
	// object out of the string that it is.
	// See http://stackoverflow.com/questions/30584476/object-properties-are-undefined-after-localstorage
	self.filterSearch = function() {
		var filter = self.filter().toLowerCase();

		// // Clean the places array to push into it the filtered locations.
		// places = [];

		// // Check if the user provided a filter string.
		// if (!filter) {
		// 	return self.locations();
		// } else {
		// 	// Populate the 'places' array based on the items of the observable array
		// 	// self.locations() that match the filter string provided by the user.
		// 	for(var i = 0; i < self.locations().length; i++) {
		// 		// Check if the current location initial substring matches 'filter'.
		// 		if ((self.locations()[i].name.toLowerCase().startsWith(filter))) {
		// 			console.log(self.locations()[i].name);
		// 			// Insert the matching location in the places array.
		// 			places.push(self.locations()[i]);
		// 		}
		// 	}
		// }
		console.log(places instanceof Array);
		console.log(places.length);

		// Clean the places array to push into it the filtered locations.
		self.locations.removeAll();

		// Check if the user provided a filter string.
		// if (!filter) {
		// 	return self.locations();
		// } else {


		// Populate the 'places' array based on the items of the observable array
		// self.locations() that match the filter string provided by the user.
		for (var i in places) {
			console.log(places[i].name);
			// Check if the current location initial substring matches 'filter'.
			if (places[i].name.toLowerCase().startsWith(filter)) {
				// Insert the matching location in the places array.
				self.locations.push(places[i]);
			}
		}


		// console.log(self.locations());

		// }

		// // Check if the user provided a filter string.
		// if (!filter) {
		// 	return self.locations();
		// } else {
		// 	// Populate the 'places' array based on the items of the observable array
		// 	// self.locations() that match the filter string provided by the user.
		// 	for(var i = 0; i < self.locations().length; i++) {
		// 		// Check if the current location initial substring matches 'filter'.
		// 		if ((self.locations()[i].name.toLowerCase().startsWith(filter))) {
		// 			console.log(self.locations()[i].name);
		// 			// Insert the matching location in the places array.
		// 			places.push(self.locations()[i]);
		// 		}
		// 	}
		// }

		// Clear out the old markers
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

		// Update the observable array locations that populate the list view..
		// self.locations(places);
		// Update the markers based on filter.
		placeMarkers(self.locations());
		// placeMarkers(places);
	};
}

// Instantiate a viewModel object.
var viewModel = new locationsViewModel();

// Activate KnockoutJS.
ko.applyBindings(viewModel);