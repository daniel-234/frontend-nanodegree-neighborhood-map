// Define global variables for the map and infoWindows instances.
var map, locationsInfoWindow, service, bounds;
// Define the div that contains the Google map.
var mapDiv = document.getElementById('map');
// Store the map center coordinates and set them to the city center
// of Cagliari, the capital town of Sardinia (IT).
var cityOfCagliari = {
				lat: 39.2151,
				lng: 9.1128
			};
// Store the map markers.
var markers = [];
var places = [];
// Store the position of the selected marker; undefined as page loads.
// As a marker is clicked, it stores its position inside the markers
// array; it is called to set the icon back to the original color when
// another marker is clicked.
var selectedMarker, selectedPlace, placeName;
// Store the map icon markers.
var greenIcon = 'img/green_marker.png';
var redIcon = 'img/red_marker.png';

// Create a map object and populate it with the result of the
// Google Places API input field.
function initMap() {
	// Create a new map JavaScript object using the coordinates
	// given by the center property.
	map = new google.maps.Map(mapDiv, {
		zoom: 15,
		center: cityOfCagliari
	});
	// Initiate a text search by calling the PlacesService's textSearch() method.
	// Return information about a set of places based on a string.
	service = new google.maps.places.PlacesService(map);
	// Make the request to the Google Search Places API passing an initial value.
	getRequest('restaurants');
}

// Call the PlacesService's textSearch method passing a value for the
// request query.
function getRequest(value) {
	// Create a request for the service callback function.
	var request = {
		location: cityOfCagliari,
		// Instruct the Places service to prefer showing results within this area.
		// If radius is turned on, the bounds parameter must be turned off.
		// radius: 500,
		// A google.maps.LatLngBounds object defining the rectangle in which to search.
		// If bounds is turned on, the radius parameter must be turned off.
		bounds: map.getBounds(),
		query: value
	};
	// Initiate a text search by calling the PlacesService's textSearch() method.
	// Return information about a set of places based on a string.
	service.textSearch(request, callback);
}

// Handle the status code passed in the maps 'PlacesServiceStatus' and the result object.
function callback(results, status) {
	// Check if the Places Service Status response is OK.
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// Empty the locations observable array.
		viewModel.locations.removeAll();
		places = [];
		markers = [];
		// Create an infoWindow instance.
		locationsInfoWindow = new google.maps.InfoWindow();
		// Loop over the results array returned by the callback.
		for (var i = 0; i < results.length; i++) {
			// Store the result.
			var place = results[i];
			places.push(place);
			addMarker(place, i);
			// Insert the results locations into the ViewModel locations
			// observable array.
			viewModel.locations.push(new LocationItem(place));
			viewModel.filteredMarkers.push(new LocationItem(place));

			// placeMarkers(place);
			// addMarker(place, i);
		}


		// // placeMarkers(places);
		// placeMarkers(viewModel.locations());


		// Set query back to the empty string.
		// As the input text works both as textSearch for the Google Places API and
		// for the filter, the input text must be cleared after the results have been
		// stored to not interfere with the filter.
		viewModel.query('');
	} else {
		// Handle the case when the Google Places API returns an error.
		alert('There was a problem contacting the Google servers. Please, check the JavaScript console fo more details.');
		console.log(google.maps.places.PlacesServiceStatus);
	}
}

// Place the markers in the map at the returned places coordinates.
function placeMarkers(placesResults) {
	// For each result, place a marker in the map and add a list item.
	for (var i = 0; i < placesResults.length; i++) {
		// Store the result.
		var place = placesResults[i];
		// Add a new marker to the map.
		addMarker(place, i);
	}
}

// Create a marker with an infoWindow and insert it into the 'markers' array.
// Create a list item connected to an appropriate marker.
function addMarker(place, listPos) {
	// Store the marker title.
	var locationName = place.name;
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
		title: locationName,
		id: listPos,
		visible: true
	});
	// Compose the Wikipedia URL search string with the search term. Query the Wikipedia
	// Code taken from the Wikipedia API lesson of the course.
	// Query the English Wikipedia API; to query the Italian API, change 'en' to 'it'.
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
		locationName + '&format=json&callback=wikiCallback';
	// AJAX request object.
	$.ajax({
		url: wikiUrl,
		dataType: 'jsonp',
		success: function(response) {
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
				// Build the marker string.
				wikiAPIStr = '<p><a href="' + articleUrl + '" target="_blank">' + articleTitle + '</a></p>';
				// Add the string as a new marker property.
				marker.info = wikiAPIStr;
			} else {
				// Build the marker string.
				wikiAPIStr = '<p>No results were found on Wikipedia.</p>';
				// Add the string as a new marker property.
				marker.info = wikiAPIStr;
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
			// Add the string as a new marker property.
			marker.info = wikiAPIStr;
		}
	});
	// Add an event listener to the marker.
	// Code taken from the Google Maps API section of the course and elaborated for this app.
	marker.addListener('click', function() {
		// Set the color of the marker and populates the infoWindow.
		// var itemPos = self.locations.indexOf(place);
		var itemPos;
		for (var i = 0; i < viewModel.locations().length; i++) {
			if (locationName === viewModel.locations()[i].name) {
				itemPos = i;
			}
		}
		selectRightLocation(this, itemPos, locationsInfoWindow);

		// var itemPos = self.locations.indexOf(place);
	});
	// Insert the marker into the markers array.
	markers.push(marker);
}

// Tell the infoWindow to open at this marker and populate it with
// information specific to this marker.
// Code taken from the Google Maps API section of the course.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infoWindow is not already open on this marker.
	// if (infowindow.marker != marker) {
	// 	infowindow.marker = marker;
		// Store the marker title and a Wikipedia link.
		var content = '<div class="location-info"><div>' + marker.title + '</div>' +
			'<div>' + marker.info + '</div></div>';
		// Set the infoWindow content.
		infowindow.setContent(content);
		// Open the infoWindow.
		infowindow.open(map, marker);
		// Set the icon of the marker to green as the infowindow opens.
		marker.setIcon(greenIcon);
		// Center marker when it's active on click to provide better UX experience.
		map.panTo(marker.getPosition());
		// Set the boolean observable of the selected location to true to highlight
		// the corresponding list item.
		selectedPlace.currentSelection(true);
		// Make sure the marker property is cleared if the infoWindow is closed.
		infowindow.addListener('closeclick', function() {
			// Close the infoWindow on this marker.
			infowindow.marker = null;
			// Set the icon of the marker back to red as we close the infoWindow.
			marker.setIcon(redIcon);
			// Set the boolean observable of the selected location to false to remove the highlight
			// from the corresponding list item when the infoWindow is closed.
			selectedPlace.currentSelection(false);
		});
	// }
}

// Set the background color of the selected item and the color of the equivalent marker.
// Populate the appropriate infoWindow.
function selectRightLocation(marker, locationsPos, infowindow) {
	console.log(marker.id);
	viewModel.locations().forEach(function(location) {
		location.currentSelection(false);
	});
	// viewModel.locations()[locationsPos].currentSelection(true)
	// Check if there is a marker already selected; if there is one, deselect it.
	// Retrieve it from the array, set back its icon to the normal red icon and
	// set the background color of the equivalent list element to normal.
	if ((marker.id !== selectedMarker) && (selectedMarker !== undefined)) {
		markers[selectedMarker].setIcon(redIcon);
		// if (typeof(selectedPlace) !== 'undefined') {
		// 	selectedPlace.currentSelection(false);
		// }
		// selectedLocation.currentSelection(false);
		console.log(selectedMarker);
	}

	// if (selectedMarker !== undefined && i === selectedMarker) {
	// 	selectedLocation.currentSelection(true);
	// 	// self.locations.push();
	// }

	// if (selectedMarker !== undefined && filtered.indexOf(selectedMarker) < 0) {
	// 	markers[selectedMarker].setIcon(redIcon);
	// 	locationsInfoWindow.close();
	// 	selectedPlace = undefined;
	// 	selectedMarker = undefined;
	// }



	// If there was a location already selected, set its boolean observable property to false to
	// remove its highlighting.
	// if (typeof(selectedPlace) !== 'undefined') {
	// 	selectedPlace.currentSelection(false);
	// }

	// Assign the current item position inside the markers array to variable 'selectedMarker'.
	// selectedMarker = itemPos;
	selectedMarker = marker.id;
	// Store the selected location object.
	console.log(viewModel.locations()[locationsPos]);
	selectedPlace = viewModel.locations()[locationsPos];
	// selectedPlace = new LocationItem(places[marker.id]);
	console.log(selectedPlace.name);
	// placeName = selectedPlace.name;
	placeName = marker.title;
	console.log(placeName);
	console.log(locationsPos);
	// Change icon color of the selected marker and equivalent list item and populate the
	// info window.
	populateInfoWindow(marker, locationsInfoWindow);
}

// Display an error message to the user if the map fails to load.
function googleError() {
	// Set the control variable to true.
	viewModel.isError(true);
	return viewModel.message();
}

// Create a location object with a new property used to toggle a class in the CSS binding.
var LocationItem = function(data) {
	var self = this;
	self.name = data.name;
	self.geometry = data.geometry;
	// Boolean observable that is updated to true when this item is selected by the user.
	self.currentSelection = ko.observable(false);
};

// Knockout ViewModel.
//
// Store the locations as an observable array inside the ViewModel.
function LocationsViewModel() {
	var self = this;
	// Observable that holds the input value.
	self.query = ko.observable('');
	// Define an observable array that will hold the location objects.
	self.locations = ko.observableArray([]);
	// Define an observable array that will hold the filtered objects.
	self.filteredMarkers = ko.observableArray([]);
	// Observable variable that gets set to true if the 'onerror' callback is called by the
	// asynchronous call.
	self.isError = ko.observable(false);
	// Hold the error message content.
	var errorMessage = 'Something went wrong when loading Google Maps.' +
		'\nCheck the JavaScript console for details.';
	// Observable variable that holds the error message.
	self.message = ko.observable(errorMessage);
	// Observable for the error message font size.
	self.fontSize = ko.observable('x-large');
	// Knockout computed that returns a JavaScript object where the property names correspond to
	// style names and the values correspond to style values we wish to apply.
	self.fontSizeCSS = ko.computed(function() {
		return {'font-size': self.fontSize()};
	});
	// Provide a filter functionality that should filter (show or hide) the
	// existing list of locations as well as markers on the map.
	// It returns the matching subset of the original array of items.
	self.filteredLocations = ko.computed(function() {
		// Store the query term.
		var filter = self.query().toLowerCase();
		// Define an array to save the filtered locations.
		var newArr = [];
		// var listPosition;
		// Check if the filter query is empty.
		if (!filter) {
			// Update the observable that updates the markers on the map.
			// self.filteredMarkers(self.locations());
			// Clear out the old markers
			self.locations.removeAll();

			console.log('go');
			console.log(placeName);

			markers.forEach(function(marker) {
				marker.setVisible(true);
			});

			// places.forEach(function(place) {
			// 	self.locations.push(new LocationItem(place));
			// });

			// if (typeof(selectedPlace) !== 'undefined') {
			// 	selectedPlace.currentSelection(true);
			// }

			// for (var j = 0; j < self.locations().length; j++) {
			// 	if (placeName === self.locations()[j].name) {
			// 		self.locations()[j].currentSelection(true);
			// 		// isIn = true;
			// 		console.log('true')
			// 	// } else {
			// 	// 	// selectedPlace.currentSelection(false);
			// 	// 	selectedPlace = undefined;
			// 	// 	placeName = undefined;
			// 	}
			// }

			for (var i = 0; i < places.length; i++) {
				// console.log(self.locations().length);
				// if (places[i].name.toLowerCase().indexOf(filter) >= 0) {
					var newPlace = places[i];
					// console.log(places[i]);
					// console.log(places[i].name.toLowerCase());
					// self.filteredMarkers.push(new LocationItem(newPlace));
					var selectedLocation = new LocationItem(newPlace);
					if (selectedMarker !== undefined && i === selectedMarker) {
						selectedLocation.currentSelection(true);
						// self.locations.push();
					}
					self.locations.push(selectedLocation);
					// console.log(markers[i]);
					// markers[i].setVisible(true);
					// filtered.push(i);
				// }

			}


			// markers = [];
			// If there was a location already selected, set its boolean observable property
			// to false to remove its highlighting.
			// if (typeof(selectedPlace) !== 'undefined') {
			// 	selectedPlace.currentSelection(false);
			// }
			// Remove the reference to the selected marker.
			// As the locations array has been cleared, the next selection must lose
			// reference to the old one.
			// selectedMarker = undefined;
			// Update the markers based on what locations objects are stored into the
			// observable array that updates the markers.
			// placeMarkers(self.filteredMarkers());
			// Keep the list in sync with the markers and return the same array value.
			return self.locations();

		} else {
			var listPosition;
			markers.forEach(function(marker) {
				marker.setVisible(false);
			});

			// console.log(self.filteredMarkers());
			// console.log(self.locations());
			// console.log(places);
			// console.log(self.locations().length);
			// console.log(places.length);
			// placeName = selectedPlace.name;
			self.locations.removeAll();
			console.log(placeName);

			// selectedPlace.currentSelection(true);

			// self.filteredMarkers.removeAll();
			console.log(self.locations().length);

			// for (var i = 0; i < places.length; i++) {
			// 	// console.log(self.locations().length);
			// 	if (places[i].name.toLowerCase().indexOf(filter) >= 0) {
			// 		var newPlace = places[i];
			// 		// console.log(places[i]);
			// 		// console.log(places[i].name.toLowerCase());
			// 		self.locations.push(new LocationItem(newPlace));
			// 		// console.log(markers[i]);
			// 		markers[i].setVisible(true);
			// 	}
			// }


			var isIn = true;
			var filtered = [];
			for (var i = 0; i < places.length; i++) {
				// console.log(self.locations().length);
				if (places[i].name.toLowerCase().indexOf(filter) >= 0) {
					var newPlace = places[i];
					// console.log(places[i]);
					// console.log(places[i].name.toLowerCase());
					// self.filteredMarkers.push(new LocationItem(newPlace));
					var selectedLocation = new LocationItem(newPlace);
					if (selectedMarker !== undefined && i === selectedMarker) {
						selectedLocation.currentSelection(true);
						// self.locations.push();
					}
					self.locations.push(selectedLocation);
					// console.log(markers[i]);
					if (markers.length > 0) {
						markers[i].setVisible(true);
						console.log(markers.length);
						filtered.push(i);
					}
					// markers[i].setVisible(true);
					// filtered.push(i);
				}

			}

			// console.log(placeName);
			// console.log(placeName.length);
			// console.log(typeof(placeName));



			// for (var j = 0; j < self.locations().length; j++) {
			// 	if (placeName === self.locations()[j].name) {
			// 		listPosition = j;
			// 		// self.locations()[j].currentSelection(true);
			// 		isIn = true;
			// 		console.log('true')
			// 	} else {
			// 		// console.log(placeName);
			// 	// 	// selectedPlace.currentSelection(false);
			// 		isIn = false;
			// 	// 	// selectedPlace = undefined;
			// 	// 	placeName = '';
			// 	}
			// 	console.log(placeName);
			// }

			// for (var j = 0; j < self.locations().length; j++) {
			// 	if (placeName === self.locations()[j].name) {
			// 		selectedPlace = self.locations()[j];
			// 		self.locations()[j].currentSelection(true);
			// 		// isIn = true;
			// 		console.log('true')
			// 	} else {
			// 		// selectedPlace.currentSelection(false);
			// 		selectedPlace = undefined;
			// 		placeName = undefined;
			// 	}
			// }

			console.log(filtered);
			console.log(filtered.length);
			// console.log(selectedPlace.name);

			if (selectedMarker !== undefined && filtered.indexOf(selectedMarker) < 0) {
				markers[selectedMarker].setIcon(redIcon);
				locationsInfoWindow.close();
				selectedPlace = undefined;
				selectedMarker = undefined;
			}

			// console.log(listPosition);
			// if (listPosition !== undefined) {
			// 	self.locations()[listPosition].currentSelection(true);
			// 	// selectedPlace.currentSelection(true);
			// 	// console.log('false');
			// 	console.log('yes');
			// 	// placeName = '';
			// } else {
			// 	console.log('no');
			// 	placeName = '';
			// }


			// if (typeof(selectedPlace) !== 'undefined' && !isIn) {
			// 	// selectedPlace.currentSelection(false);
			// 	selectedPlace = undefined
			// }


			// console.log(self.locations().length);
			// console.log(self.filteredMarkers());

			// markers.forEach(function(marker) {
			// 	console.log(marker.title);
			// });

			// self.locations().forEach(function(location) {
			// 	console.log(location.name);
			// });




			// for (var i = 0; i < self.filteredMarkers.length; i++) {
			// 	console.log(places[i].name);
			// 	console.log(markers[i].title);
			// 	console.log(self.filteredMarkers[i].name);
			// }






			// // Store the filtered locations.
			// newArr = ko.utils.arrayFilter(self.locations(), function(location) {
			// 	return stringStartsWith(location.name.toLowerCase(), filter);
			// });
			// // Update the observable that updates the markers on the map.
			// self.filteredMarkers(newArr);


			// // Clear out the old markers



			// If there was a location already selected, set its boolean observable property
			// to false to remove its highlighting.
			// if (typeof(selectedPlace) !== 'undefined') {
			// 	selectedPlace.currentSelection(false);
			// }
			// Remove the reference to the selected marker.
			// As the locations array has been cleared, the next selection must lose
			// reference to the old one.
			// selectedMarker = undefined;
			// Update the markers based on what locations objects are stored into the
			// observable array that updates the markers.
			// placeMarkers(self.filteredMarkers());
			// Keep the list in sync with the markers and return the same array value.
			return self.locations();
		}
	});

	// Search the Google Places API if there is a valid string.
	self.searchPlacesAPI = function() {
		if (self.query() !== '') {
			console.log('query');
			getRequest(self.query());
		}
	};

	// Get the position of the selected item and select the equivalent marker.
	self.selectListPlace = function(listPlace) {
		// Get the index position of the selected list item from the filtered list.
		var markerPos;
		for (var i = 0; i < places.length; i++) {
			if (listPlace.name === places[i].name) {
				markerPos = i;
			}
		}
		var itemPos = self.locations.indexOf(listPlace);
		if (itemPos) {
			console.log(places);
			console.log(itemPos);
			console.log(markerPos);
			console.log(listPlace.name);
		}

		// Change icon color of the equivalent marker and populate its infoWindow.
		selectRightLocation(markers[markerPos], itemPos, locationsInfoWindow);

	};
}

// StartsWith method taken from a sample on this answer in Stackoverflow:
// http://stackoverflow.com/questions/28042344/filter-using-knockoutjs
var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

// Instantiate a new LocationsViewModel object.
var viewModel = new LocationsViewModel();

// Activate KnockoutJS.
ko.applyBindings(viewModel);