// Define global variables for the map and infoWindows instances.
var map, locationsInfoWindow, service;
// Store the map center coordinates.
var cityOfCagliari = {
				lat: 39.2151,
				lng: 9.1128
			};
// Create an array to hold the markers.
var markers = [];

// Store the map icon markers.
var green_icon = 'img/green_marker.png';
var red_icon = 'img/red_marker.png';

// Create a custom binding handler to interact with the Google Maps API.
ko.bindingHandlers.map = {
	// Define an 'init' callback to be called once for the DOM element
	// the callback is used on (in this case, the div with id='map').
	init: function(element, valueAccessor) {
		// Create a new map JavaScript object using the coordinates
		// given by the center position property of the ViewModel.
		map = new google.maps.Map(element, {
			zoom: 15,
			center: cityOfCagliari
		});
		// Create a request for the service callback function.
		var request = {
			location: cityOfCagliari,
			radius: 500,
			query: 'restaurant'
		};
		// Initiate a text search by calling the PlacesService's textSearch() method.
		// Return information about a set of places based on a string.
		service = new google.maps.places.PlacesService(map);
		service.textSearch(request, callback);
	},
	// Define an 'update' callback to be called when any dependencies that
	// are accessed change.
	update: function(element, valueAccessor) {
		// Get the current model property that is involved in this binding
		var value = String(ko.unwrap(valueAccessor()));
		// Create a request for the service callback function.
		var request = {
			location: cityOfCagliari,
			radius: 500,
			query: value
		};
		// Initiate a text search by calling the PlacesService's textSearch() method.
		// Return information about a set of places based on a string.
		service = new google.maps.places.PlacesService(map);
		service.textSearch(request, callback);
	}
};

// Store the position of the selected marker; undefined as page loads.
// As a marker is clicked, it stores its position inside the markers
// array; it is called to set the icon back to the original color when
// another marker is clicked.
var selected_marker;

// Handle the status code passed in the maps 'PlacesServiceStatus' and the result object.
function callback(results, status) {
	// Store the element with id='input-list'.
	var elem = document.getElementById('input-list');
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// Check if there are old markers and clear them out.
		if (markers.length > 0) {
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
			markers = [];
		}

		// Create an infoWindow instance.
		locationsInfoWindow = new google.maps.InfoWindow();
		console.log(locationsInfoWindow);

		// Remove the child elements of elem, if any exists.
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}

		// Create an unordered list and store it.
		var uList = document.createElement('ul');

		// For each result, place a marker in the map and add a list item.
		for (var i = 0; i < results.length; i++) {
			// Store the result.
			var place = results[i];
			// Add a new marker to the map.
			addMarker(place, i);
			// Create a list item with the place name as text content and append it.
			var listItem = document.createElement('li');
			var newContent = document.createTextNode(place.name);
			listItem.appendChild(newContent);
			listItem.id = "item_" + i;
			console.log(listItem.id);
			uList.appendChild(listItem);
		}

		// Append the unordered list to the div element..
		elem.appendChild(uList);
	}
}

// Create a marker with an infoWindow and insert it into the 'markers' array.
function addMarker(place, listPos) {
	// Store the marker title.
	var title = place.name;
	// Define a variable to store the Wikipedia repsonse link.
	var wikiAPIStr;
	// Create a new marker for each place
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
	// Set this marker id; univocal for each marker.
	marker.set('id', 'item_' + listPos);
	console.log(marker.get('id'));

	// Store the place name.
	var locationString = place.name;
	// Compose the Wikipedia URL search string with the search term.
	// Code taken from the Wikipedia API lesson of the course.
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
		locationString + '&format=json&callback=wikiCallback';

	// AJAX request object.
	$.ajax({
		url: wikiUrl,
		dataType: 'jsonp',
		success: function(response) {
			// Take the first element of the response Array as the article title.
			var articleTitle = response[0];
			// There may be more than one article in the response 4th element. Take only the first link,
			// that should be the most representative.
			var articleUrl = response[3][0];
			// The AJAX response is an Array with 4 elements. The Wikipedia link that's of interest to the
			// marker infoWindow is stored at position 3 (of a 0-based array).
			// If the response array has a 4th element, compose the link; otherwise, provide a standard
			// replacement message.
			if (response[3].length > 0) {
				wikiAPIStr = '<p><a href="' + articleUrl + '" target="_blank">' + articleTitle + '</a></p>';
			} else {
				wikiAPIStr = '<p>No results were found on Wikipedia.</p>'
			}
		}
	});

	// Add an event listener so that the infoWindow only opens
	// when we click on the marker.
	// Code taken from the Google Maps API section of the course.
	marker.addListener('click', function() {
		// Check if there is a marker already selected; it there is
		// one, select it from the array and set back its icon to the
		// normal red value.
		if (selected_marker !== undefined) {
			markers[selected_marker].setIcon(red_icon);
		}
		// Assign the current marker position inside the markers array
		// to variable 'selected_marker'.
		console.log(selected_marker);
		selected_marker = listPos;
		console.log(selected_marker);
		// Call a function to populate the infoWindow on the selected marker.
		populateInfoWindow(this, locationsInfoWindow, wikiAPIStr);
		// Set the icon of the selected marker to the green color.
		marker.setIcon(green_icon);
	});
	// Insert the marker into the markers array.
	markers.push(marker);
}

// Tell the infoWindow to open at this marker and populate it with
// information specific to this marker.
// Code taken from the Google Maps API section of the course.
function populateInfoWindow(marker, infowindow, wikiAPIStr) {
	// Check to make sure the infoWindow is not already open on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		// Store the marker title and a Wikipedia link.
		var content = '<div class="location-info"><div>' + marker.title + '</div>' +
			'<div>' + wikiAPIStr + '</div></div>'
		// Set the infoWindow content.
		infowindow.setContent(content);
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infoWindow is closed.
		infowindow.addListener('closeclick', function() {
			// Close the infoWindow on this marker.
			infowindow.marker = null;
			// Set the icon of the marker back to red as we close the infoWindow.
			marker.setIcon(red_icon);
		});
	}
}

// Instantiate the ViewModel and activate KnockoutJS inside a callback function.
// This makes sure that the Google Maps API has finished loading before we use
// this script that depends on the Google Maps API.
//
// Suggestion taken from a response in the discussion forum:
// https://discussions.udacity.com/t/map-async-moved-after-app-js/216797/2
function activateKO() {
	// Store the position of the map center and the query input value as an Observable.
	var ViewModel = function() {
		var self = this;
		// self.position = {
		// 	center: {
		// 		lat: 39.2151,
		// 		lng: 9.1128
		// 	}
		// };

		// Define an Observable variable.
		self.query = ko.observable();
		// Update the query value.
		self.filterSearch = function() {
			self.query(self.query());
		};
	};

	// Activate KnockoutJS.
	ko.applyBindings(new ViewModel());
}