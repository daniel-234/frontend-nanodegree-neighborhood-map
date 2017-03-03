// Define global variables for the map and infoWindows instances.
var map, locationsInfoWindow, service, bounds;
// Store the map center coordinates and set them to the city center
// of Cagliari, the capital town of Sardinia (IT).

var mapDiv = document.getElementById('map');

var cityOfCagliari = {
				lat: 39.2151,
				lng: 9.1128
			};
// Create an array to hold the markers.
var places = [];
var markers = [];
// Create an array to hold the places returned by the Google Maps Autocomplete API.
var places = [];
// Store the position of the selected marker; undefined as page loads.
// As a marker is clicked, it stores its position inside the markers
// array; it is called to set the icon back to the original color when
// another marker is clicked.
var selectedMarker, selectedPlace;
// Store the map icon markers.
var greenIcon = 'img/green_marker.png';
var redIcon = 'img/red_marker.png';

var oldQuery = 'restaurants';

function initMap() {
	// Create a new map JavaScript object using the coordinates
	// given by the center property.
	map = new google.maps.Map(mapDiv, {
		zoom: 15,
		center: cityOfCagliari
	});

	// Create a request for the service callback function.
	// var request = {
	// 	location: cityOfCagliari,
	// 	// Instruct the Places service to prefer showing results within this area.
	// 	// If radius is turned on, the bounds parameter must be turned off.
	// 	// radius: 500,
	// 	// A google.maps.LatLngBounds object defining the rectangle in which to search.
	// 	// If bounds is turned on, the radius parameter must be turned off.
	// 	bounds: map.getBounds(),
	// 	// query: 'restaurants'
	// 	query: oldQuery
	// };
	// Initiate a text search by calling the PlacesService's textSearch() method.
	// Return information about a set of places based on a string.
	service = new google.maps.places.PlacesService(map);
	// service.textSearch(request, callback);
	getRequest(oldQuery);
}

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
	// Store the element with id='input-list'.
	var elem = document.getElementById('input-list');

	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// places = [];
		// viewModel.locations(places);
		console.log(results);
		// Check if there are old markers and clear them out.
		if (markers.length > 0) {
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
			markers = [];
		}

		// Empty the locations observable array.
		viewModel.locations.removeAll();

		// Create an infoWindow instance.
		locationsInfoWindow = new google.maps.InfoWindow();

		places = [];

		for (var i = 0; i < results.length; i++) {
			// Store the result.
			var place = results[i];
			places.push(place);
			viewModel.locations.push(new LocationItem(place));
		}


		placeMarkers(places);

		console.log(places);
		viewModel.query('');
	} else {
		alert('There was a problem contacting the Google servers. Please, check the JavaScript console fo more details.');
		console.log(google.maps.places.PlacesServiceStatus);
	}
}

// Place the markers in the map at the returned places coordinates.
function placeMarkers(placesResults) {
	// places = [];
	// For each result, place a marker in the map and add a list item.
	for (var i = 0; i < placesResults.length; i++) {
		// Store the result.
		var place = placesResults[i];
		// places.push(place);
		// viewModel.locations.push(new LocationItem(place));
		// Add a new marker to the map.
		addMarker(place, i);
		console.log(place);
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
		title: locationName
	});
	// Create an infoWindow instance.
	// locationsInfoWindow = new google.maps.InfoWindow();
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
	console.log(marker);
	// Add an event listener to the marker.
	// Code taken from the Google Maps API section of the course and elaborated for this app.
	marker.addListener('click', function() {
		// Set the color of the marker and populates the infoWindow.
		selectRightLocation(this, listPos, locationsInfoWindow);
	});
	// Insert the marker into the markers array.
	markers.push(marker);
}

// Tell the infoWindow to open at this marker and populate it with
// information specific to this marker.
// Code taken from the Google Maps API section of the course.
function populateInfoWindow(marker, itemPosition, infowindow) {
	// Check to make sure the infoWindow is not already open on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
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
	}
}

// Set the background color of the selected item and the color of the equivalent marker.
// Populate the appropriate infoWindow.
function selectRightLocation(marker, itemPos, infowindow) {
	// Check if there is a marker already selected; if there is one, deselect it.
	// Retrieve it from the array, set back its icon to the normal red icon and
	// set the background color of the equivalent list element to normal.
	if ((itemPos !== selectedMarker) && (selectedMarker !== undefined)) {
		markers[selectedMarker].setIcon(redIcon);
		console.log(selectedMarker);
	}
	// If there was a location already selected, set its boolean observable property to false to
	// remove its highlighting.
	if (typeof(selectedPlace) !== 'undefined') {
		selectedPlace.currentSelection(false);
	}
	// console.log(locationsInfoWindow);
	// console.log(locationsInfoWindow);
	// Assign the current item position inside the markers array to variable 'selectedMarker'.
	selectedMarker = itemPos;
	// Store the selected location object.
	selectedPlace = viewModel.filteredMarkers()[itemPos];
	// Change icon color of the selected marker and equivalent list item and populate the
	// info window.
	populateInfoWindow(marker, itemPos, locationsInfoWindow);
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


	// self.filterLocations = function(value) {
	// 	// var filter = self.query().toLowerCase();
	// 	// Empty the observable array to update the related UI view.
	// 	self.locations.removeAll();
	// 	// Populate the 'places' array based on the items of the observable array
	// 	// self.locations() that match the filter string provided by the user.
	// 	for (var i = 0; i < places.length; i++) {
	// 		// Check if the current location initial substring matches 'filter'.
	// 		if (places[i].name.toLowerCase().startsWith(value)) {
	// 			// Insert the matching location in the places array.
	// 			self.locations.push(new LocationItem(places[i]));
	// 		}
	// 	}
	// 	// Clear out the old markers
	// 	markers.forEach(function(marker) {
	// 		marker.setMap(null);
	// 	});
	// 	markers = [];
	// 	// Remove the reference to the selected marker.
	// 	// As the locations array has been cleared, the next selection has to not hold
	// 	// reference to the old one.
	// 	selectedMarker = undefined;
	// 	// Update the markers based on what locations objects are stored into the observable array.
	// 	placeMarkers(self.locations());
	// };





	self.filteredLocations = ko.computed(function() {
		var filter = self.query().toLowerCase();
		var newArr = [];
		if (!filter) {
			self.filteredMarkers(self.locations());
			// console.log(newArr);

			// var newArr = ko.utils.arrayFilter(self.locations(), function(location) {
			// 	return stringStartsWith(location.name.toLowerCase(), filter);
			// });
			// console.log(newArr);


			// Clear out the old markers
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
			markers = [];
			if (typeof(selectedPlace) !== 'undefined') {
				selectedPlace.currentSelection(false);
			}
			// Remove the reference to the selected marker.
			// As the locations array has been cleared, the next selection has to not hold
			// reference to the old one.
			selectedMarker = undefined;
			// // Update the markers based on what locations objects are stored into the observable array.
			// // placeMarkers(self.locations());


			placeMarkers(self.filteredMarkers());
			// return ko.utils.arrayFilter(self.locations(), function(location) {
			// 	return stringStartsWith(location.name.toLowerCase(), filter);
			// });
			return self.filteredMarkers();


			// // Clear out the old markers
			// markers.forEach(function(marker) {
			// 	marker.setMap(null);
			// });
			// markers = [];
			// // Remove the reference to the selected marker.
			// // As the locations array has been cleared, the next selection has to not hold
			// // reference to the old one.
			// selectedMarker = undefined;
			// // Update the markers based on what locations objects are stored into the observable array.
			// // placeMarkers(self.locations());


			// placeMarkers(newArr);
			// // return ko.utils.arrayFilter(self.locations(), function(location) {
			// // 	return stringStartsWith(location.name.toLowerCase(), filter);
			// // });
			// return newArr;


			// placeMarkers(self.locations());
			// return self.locations();
		} else {
			newArr = ko.utils.arrayFilter(self.locations(), function(location) {
				return stringStartsWith(location.name.toLowerCase(), filter);
			});
			console.log(newArr);
			self.filteredMarkers(newArr);
	// 		self.filteredMarkers.removeAll();
	// 		for (var i = 0; i < self.locations(); i++) {
	// 			if (self.locations()[i].name.toLowerCase().startsWith(filter)) {
	// 				// Insert the matching location in the places array.
	// 				self.filteredMarkers.push(new LocationItem(self.locations[i]));
	// 			}
	// // 		})
	// 		}


			// Clear out the old markers
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
			markers = [];
			if (typeof(selectedPlace) !== 'undefined') {
				selectedPlace.currentSelection(false);
			}
			// Remove the reference to the selected marker.
			// As the locations array has been cleared, the next selection has to not hold
			// reference to the old one.
			selectedMarker = undefined;
			// // Update the markers based on what locations objects are stored into the observable array.
			// // placeMarkers(self.locations());

			placeMarkers(newArr);

			return newArr;

			// placeMarkers(self.filteredMarkers());
			// // return ko.utils.arrayFilter(self.locations(), function(location) {
			// // 	return stringStartsWith(location.name.toLowerCase(), filter);
			// // });
			// return self.filteredMarkers();
		}
	});


	// var stringStartsWith = function (string, startsWith) {
	//     string = string || "";
	//     if (startsWith.length > string.length)
	//         return false;
	//     return string.substring(0, startsWith.length) === startsWith;
	// };


	// 	// Empty the observable array to update the related UI view.
	// 	self.locations.removeAll();
	// 	// Populate the 'places' array based on the items of the observable array
	// 	// self.locations() that match the filter string provided by the user.
	// 	for (var i = 0; i < places.length; i++) {
	// 		// Check if the current location initial substring matches 'filter'.
	// 		if (places[i].name.toLowerCase().startsWith(value)) {
	// 			// Insert the matching location in the places array.
	// 			self.locations.push(new LocationItem(places[i]));
	// 		}
	// 	}
	// 	// Clear out the old markers
	// 	markers.forEach(function(marker) {
	// 		marker.setMap(null);
	// 	});
	// 	markers = [];
	// 	// Remove the reference to the selected marker.
	// 	// As the locations array has been cleared, the next selection has to not hold
	// 	// reference to the old one.
	// 	selectedMarker = undefined;
	// 	// Update the markers based on what locations objects are stored into the observable array.
	// 	placeMarkers(self.locations());
	// };



	self.searchPlacesAPI = function() {
		if (self.query() !== '') {
			getRequest(self.query());
			oldQuery = self.query();
		} else {
			getRequest(oldQuery);
		}
	};

	// Get the position of the selected item and select the equivalent marker.
	self.selectListPlace = function(listPlace) {
		// Get the index position of the selected list item.
		var itemPos = self.filteredMarkers.indexOf(listPlace);
		console.log(selectedMarker);
		console.log(itemPos);
		// Change icon color of the equivalent marker and populate its infoWindow.
		selectRightLocation(markers[itemPos], itemPos, locationsInfoWindow);

	};
}

var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};

// Instantiate a new LocationsViewModel object.
var viewModel = new LocationsViewModel();

// viewModel.filteredMarkers.subscribe(viewModel.filteredLocations);

// Activate KnockoutJS.
ko.applyBindings(viewModel);