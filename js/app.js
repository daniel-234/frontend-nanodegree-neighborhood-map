// Define global variables for the map and infoWindows instances.
var map, locationsInfoWindow, service;
// Store the map center coordinates and set them to the city center
// of Cagliari, the capital town of Sardinia (IT).
var cityOfCagliari = {
				lat: 39.2151,
				lng: 9.1128
			};

var mapDiv = document.getElementById('map');
// Create an array to hold the markers.
var markers = [];
var places = [];

// Create an array with 5 locations to be displayed by default when the page loads.
var locations = [
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
		name: 'Pinacoteca Nazionale di Cagliari',
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

// Create a custom binding handler to interact with the Google Maps API.
ko.bindingHandlers.map = {
	// Define an 'init' callback to be called once for the DOM element
	// the callback is used on (in this case, the div with id='map').
	// init: function(element, valueAccessor) {
	// 	// Create a new map JavaScript object using the coordinates
	// 	// given by the center property.
	// 	map = new google.maps.Map(element, {
	// 		zoom: 15,
	// 		center: cityOfCagliari
	// 	});
	// 	// Create a request for the service callback function.
	// 	var request = {
	// 		location: cityOfCagliari,
	// 		// Instruct the Places service to prefer showing results within this area.
	// 		// If radius is turned on, the bounds parameter must be turned off.
	// 		// radius: 500,
	// 		// A google.maps.LatLngBounds object defining the rectangle in which to search.
	// 		// If bounds is turned on, the radius parameter must be turned off.
	// 		bounds: map.getBounds(),
	// 		query: 'restaurant'
	// 	};
	// 	// Initiate a text search by calling the PlacesService's textSearch() method.
	// 	// Return information about a set of places based on a string.
	// 	service = new google.maps.places.PlacesService(map);
	// 	service.textSearch(request, callback);
	// },
	// Define an 'update' callback to be called when any dependencies that
	// are accessed change.
	update: function(element, valueAccessor) {
		// Get the current model property that is involved in this binding
		var value = String(ko.unwrap(valueAccessor()));

		// Create a new map JavaScript object using the coordinates
		// given by the center property.
		map = new google.maps.Map(element, {
			zoom: 15,
			center: cityOfCagliari
		});
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
		service = new google.maps.places.PlacesService(map);
		service.textSearch(request, callback);
	}
};


function initMap() {
	// Create a new map JavaScript object using the coordinates
	// given by the center property.
	map = new google.maps.Map(mapDiv, {
		zoom: 15,
		center: cityOfCagliari
	});

	localStorage['locations'] = JSON.stringify(locations);
	places = JSON.parse(localStorage['locations']);

	viewModel.locations(places);

	// For each place, get the name and location
	var bounds = new google.maps.LatLngBounds();

	placeMarkers(places, bounds);


	// places.forEach(function(place) {
	// 	if(!place.geometry) {
	// 		console.log('Returned place contains no geometry');
	// 		return;
	// 	}

	// 	console.log(places);

	// 	// Create a marker for each place
	// 	markers.push(new google.maps.Marker({
	// 		map: map,
	// 		title: place.name,
	// 		position: place.geometry.location
	// 	}));

	// 	if (place.geometry.viewport) {
	// 		// Only geocodes have viewport
	// 		bounds.union(place.geometry.viewport);
	// 	} else {
	// 		bounds.extend(place.geometry.location);
	// 	}
	// });

	// map.fitBounds(bounds);


	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);

	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	searchBox.addListener('places_changed', function() {
		places = searchBox.getPlaces();
		viewModel.locations(places);

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

		// For each place, get the name and location
		// var bounds = new google.maps.LatLngBounds();

		placeMarkers(places, bounds);


	});
}

function placeMarkers(places, bounds) {
	places.forEach(function(place) {
		if(!place.geometry) {
			console.log('Returned place contains no geometry');
			return;
		}

		console.log(places);

		// Create a marker for each place
		markers.push(new google.maps.Marker({
			map: map,
			title: place.name,
			position: place.geometry.location
		}));

		if (place.geometry.viewport) {
			// Only geocodes have viewport
			bounds.union(place.geometry.viewport);
		} else {
			bounds.extend(place.geometry.location);
		}
	});

	map.fitBounds(bounds);
}


// Handle the status code passed in the maps 'PlacesServiceStatus' and the result object.
function callback(results, status) {
	// Store the element with id='input-list'.
	var elem = document.getElementById('input-list');

	locations = results;


	console.log(markers);
	console.log(locations);


	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// Check if there are old markers and clear them out.
		if (markers.length > 0) {
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
			markers = [];
		}

		// Remove the child elements of elem, if any exists.
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}

		// Create an infoWindow instance.
		locationsInfoWindow = new google.maps.InfoWindow();

		// Create an unordered list and store it.
		var uList = document.createElement('ul');
		// Append a class to the unordered list.
		uList.classList.add('no-bullets');
		// Append the list to the appropriate div.
		elem.appendChild(uList);

		// For each result, place a marker in the map and add a list item.
		for (var i = 0; i < results.length; i++) {
			// Store the result.
			var place = results[i];
			// Add a new marker and a list item to the map.
			addMarker(place, i, uList, elem);
		}
	} else {
		alert('There was a problem contacting the Google servers. Please, check the JavaScript console fo more details.');
		console.log(google.maps.places.PlacesServiceStatus);
	}
}

// Create a marker with an infoWindow and insert it into the 'markers' array.
// Create a list item connected to an appropriate marker.
function addMarker(place, listPos, uList, elem) {
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

	// Create a list item with the place name as text content and append it.
	var listItem = document.createElement('li');
	var newContent = document.createTextNode(place.name);
	listItem.appendChild(newContent);
	listItem.id = "item_list" + listPos;
	uList.appendChild(listItem);

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

	// Add an event listener.
	// Code taken from the Google Maps API section of the course and elaborated for this
	// app.
	marker.addListener('click', function() {
		// Set background color of the list item, the color of the marker and populates
		// the infoWindow.
		selectRightLocation(this, listItem, locationsInfoWindow, wikiAPIStr);
	});

	// Insert the marker into the markers array.
	markers.push(marker);

	// Add an event listener to the list element.
	listItem.addEventListener('click', function() {
		// Set background color of the list item, the color of the marker and populates
		// the infoWindow.
		selectRightLocation(marker, this, locationsInfoWindow, wikiAPIStr);
	});
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
		setListItemBackground(itemPosition, 'limegreen');
		// Make sure the marker property is cleared if the infoWindow is closed.
		infowindow.addListener('closeclick', function() {
			// Close the infoWindow on this marker.
			infowindow.marker = null;
			// Set the icon of the marker back to red as we close the infoWindow.
			marker.setIcon(redIcon);
			// Set the background color of the correspondent list item to normal.
			setListItemBackground(itemPosition, 'white');
		});
	}
}

// Set the background color of the list item at position itemPos to color.
function setListItemBackground(itemPos, color) {
	document.getElementById("item_list" + itemPos).style.backgroundColor = color;
}

// Set the background color of the selected item and the color of the equivalent marker.
// Populate the appropriate infoWindow.
function selectRightLocation(marker, listItem, locationsInfoWindow, wikiAPIStr) {
	// Store the position of the selected list item, taking it from its id.
	var itemNumber = listItem.id.substr(9);
	// Check if there is a marker already selected; if there is
	// one, deselect it.
	// Retrieve it from the array, set back its icon to the normal red icon and
	// set the background color of the equivalent list element to normal.
	if ((itemNumber !== selectedMarker) && (selectedMarker !== undefined)) {
		markers[selectedMarker].setIcon(redIcon);
		setListItemBackground(selectedMarker, 'white');
	}
	// Assign the current item position inside the markers array
	// to variable 'selectedMarker'.
	selectedMarker = itemNumber;
	// Call a function to higlight the selected list item and the equivalent marker and
	// populate the chosen marker's infoWindow..
	populateInfoWindow(marker, locationsInfoWindow, wikiAPIStr, itemNumber);
}

// Display an error message to the user if the map fails to load.
function googleError() {
	var message = document.createElement('p');
	message.classList.add('error-message');
	message.innerHTML = 'Something went wrong when loading Google Maps.' + '<br />' +
		'Check the JavaScript console for details.';
	var mapDiv = document.getElementById('map');
	mapDiv.append(message);
}

// Instantiate the ViewModel and activate KnockoutJS inside a callback function.
// This makes sure that the Google Maps API has finished loading before we use
// this script that depends on the Google Maps API.
//
// Suggestion taken from a response in the discussion forum:
// https://discussions.udacity.com/t/map-async-moved-after-app-js/216797/2
// function activateKO() {
	// Store the position of the map center and the query input value as an Observable.
	var oldViewModel = function() {
		var self = this;
		// Define an Observable variable.
		// self.query = ko.observable('restaurant');
		self.locations = ko.observableArray(places);
		console.log(self.locations());
		// Update the query value.
		self.filterSearch = function() {
			self.query(self.query());
		};
	};

	function locationsViewModel(places) {
		var self = this;
		self.locations = ko.observableArray(places || []);
	}

	var viewModel = new locationsViewModel();

	// Activate KnockoutJS.
	ko.applyBindings(viewModel);
// }