# Neighborhood Map

Project 5 for the Front-End Web Developer Nanodegree consisted in the development of a single page application featuring a map of a chosen neighborhood.
Some functionality was added to this map, including highlighted locations and third-party data about these locations.
This app was developed making use of Knockout JS, a JavaScript framework implementing the MVVM design pattern, to assist in organizing code in a manageable way.
The map is loaded using the Google Maps API library and the MediaWikiAPI for Wikipedia is used to add specific content, when available, to the highlighted locations.

## Getting Started

To load the app, download a copy of the project to your local machine and open the file index.html with your browser.

## Built With

* [Bootstrap](http://getbootstrap.com/) - Framework for developing responsive, mobile first websites
* [Knockout](http://knockoutjs.com/) - A JavaScript library that simplifies dynamic JavaScript UIs
* [jQuery](http://jquery.com/) - A JavaScript library for simpler HTML manipulation and event handling
* [Google Maps API](https://developers.google.com/maps/web/) - The map API used
* [MediaWikiAPI for Wikipedia](https://www.mediawiki.org/wiki/API:Main_page) - the third party API used to provide information when a location is selected

## Author

* **Daniele Erbì** - [daniel-234](https://github.com/daniel-234)

## Notes

The app will display several locations in the city center of Cagliari (Italy) when the page is loaded.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* I relied on some answers on Stackoverflow and an article to make the map set center and bounds dynamically based on markers and viewport change:
* [Stackoverflow - Center/Set Zoom of Map to cover all visible Markers?](http://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers)
* [Stackoverflow - Google Map API v3 - set bounds and center](http://stackoverflow.com/questions/1556921/google-map-api-v3-set-bounds-and-center?rq=1)
* [Learn Tech - Google Maps API v3: Capturing viewport change - use "idle" not "bounds_changed"](https://learntech.imsu.ox.ac.uk/blog/?p=861)
* [Stackoverflow - Google Map event bounds_changed triggered multiple times when draggered](http://stackoverflow.com/questions/4338490/google-map-event-bounds-changed-triggered-multiple-times-when-dragging)
* To refactor the code to make use of the JavaScript library KnockoutJS, I used the following resources:
* [KnockoutJS documentation](http://knockoutjs.com/documentation/introduction.html)
* [Mastering KnockoutJS - by Timothy Moran](https://www.packtpub.com/web-development/mastering-knockoutjs)
* [Stackoverflow - How to display a Google map with Knockout js and HTML](http://stackoverflow.com/questions/39417762/how-to-display-a-google-map-with-knockout-js-and-html)
* [Stackoverflow - Why am I getting a "Cannot read property 'nodeType' of null" error with Knockout JS?](http://stackoverflow.com/questions/15090015/why-am-i-getting-a-cannot-read-property-nodetype-of-null-error-with-knockout)
* To handle the two Views on the same page and the different ViewModels, I relied on this answer on Stackoverflow:
* [Stackoverflow - Example of knockout js pattern for multi-view applications](http://stackoverflow.com/questions/8676988/example-of-knockoutjs-pattern-for-multi-view-applications/8680668#8680668)
* To understand the Custom Bindings feature of KnockoutJS I read several articles and some book paragraphs. The most important for adapting it to my needs were:
* [Mastering KnockoutJS - by Timothy Moran](https://www.packtpub.com/web-development/mastering-knockoutjs)
* [Another look at Custom Bindings for KnockoutJS - KnockMeOut](http://www.knockmeout.net/2011/07/another-look-at-custom-bindings-for.html)
* [JSFiddle - Knockout custom binding with multiple parameters](https://jsfiddle.net/NathanFriend/sectn9va/)
* To update the list View I used some code from the following answer on Stackoverflow:
* [Stackoverflow - Remove all child elements of a DOM node in JavaScript](http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript)
* This discussion forum helped me debug some major problems with the Wikipedia API:
* [Udacity Discussion Forums - Wikipedia API problem](https://discussions.udacity.com/t/wikipedia-api-problem/208644/12)
* Suggestions to modify the Maps markers icon on mouse click:
* [Stackoverflow - Change marker icons on mouseover (Google Maps V3)](http://stackoverflow.com/questions/8198635/change-marker-icon-on-mouseover-google-maps-v3)
* [Stackoverflow - Google Maps default icons](http://stackoverflow.com/questions/25368851/google-maps-default-icons)
* A hint from the discussion forums that helped me fix the problems with infoWindows:
* [Udacity Discussion Forums - Open and Close InfoWindow onclick?](https://discussions.udacity.com/t/open-and-close-infowindow-onclick/170572/9)
* Some suggestions on how to give each marker a different id and to change an element background color:
* [Stackoverflow - Adding IDs to Google Map markers](http://stackoverflow.com/questions/2564320/adding-ids-to-google-map-markers)
* [Stackoverflow - JavaScript adding an ID attribute to another created element](http://stackoverflow.com/questions/19625646/javascript-adding-an-id-attribute-to-another-created-element)
* [Stackoverflow - Change background color on anchor in listitem when clicked](http://stackoverflow.com/questions/12940782/change-background-color-on-anchor-in-listitem-when-clicked)
* [Stackoverflow - Get li element onclick with pure JavaScript without applying onClick to each element](http://stackoverflow.com/questions/26204120/get-li-element-onclick-with-pure-javascript-without-applying-onclick-to-each-ele)
* [Todd Motto - Attaching event handlers to dynamically created JavaScript elements](https://toddmotto.com/attaching-event-handlers-to-dynamically-created-javascript-elements/)
* [Stackoverflow - How to append a CSS class to an element by JavaScript](http://stackoverflow.com/questions/927312/how-to-append-a-css-class-to-an-element-by-javascript)
* [Stackoverflow - Need an unordered list without any bullets](http://stackoverflow.com/questions/1027354/need-an-unordered-list-without-any-bullets)
* I found this post on how to make a child div scrollable when it exceeds its parent height:
* [Stackoverflow - How to make child div scrollable when it exceeds parent height](http://stackoverflow.com/questions/27784727/how-to-make-child-div-scrollable-when-it-exceeds-parent-height)
* Suggestions on Error Handling:
* [Udacity Discussions Forums - Handling Google Maps in Async and Fallback](https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282)
* [W3C - Centering Things](https://www.w3.org/Style/Examples/007/center.en.html)
* [Stackoverflow - Add a "new-line" in innerHTML](http://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml)
* [Stackoverflow - JSONP request error handling](http://stackoverflow.com/questions/19035557/jsonp-request-error-handling)
* Acknowledgement for the README template:
* [PurpleBooth - README-Template.md](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* I read different posts on how to populate the list View using Knockout 'template' binding instead of DOM manipulation. The most complete suggestion on how to solve the problem of updating the observable array after the array it wraps is updated is the following one:
* [Stackoverflow - How do I update UI where there is a change in an observableArray?](http://stackoverflow.com/questions/11197241/how-do-i-auto-update-ui-where-there-is-a-change-in-an-observablearray)
* Some answers on Stackoverflow that helped me use localStorage to display some locations by default when the page loads:
* [Stackoverflow - How to store array in localStorage Object in HTML5?](http://stackoverflow.com/questions/19174525/how-to-store-array-in-localstorage-object-in-html5)
* [Stackoverflow - Storing Objects in HTML5 localStorage](http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage)
* Resources I used on how to provide a filter functionality:
* [Opensoul.org - Live search with Knockout.js](http://opensoul.org/2011/06/23/live-search-with-knockoutjs/)
* [KnockMeOut - Utility Functions in KnockoutJS](http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
* "A really great lesson on storing JSON objects within an array in localStorage":
* [Stackoverflow - Object properties are undefined after localStorage](http://stackoverflow.com/questions/30584476/object-properties-are-undefined-after-localstorage)
* The best way of copying/cloning an observable array in Knockout JS:
* [Stackoverflow - Copy items from observableArray to another observableArray](http://stackoverflow.com/questions/19339180/copy-items-from-observablearray-to-another-observablearray)
* [Stackoverflow - What is the best way of cloning/copying an observableArray in KnockoutJS?](http://stackoverflow.com/questions/6509297/what-is-the-best-way-of-cloning-copying-an-observablearray-in-knockoutjs)
* [Udacity Discussion Forums - KO ViewModel can't access global variable? Having trouble implementing filter function](https://discussions.udacity.com/t/ko-viewmodel-cant-access-global-variable-having-trouble-implementing-filter-function/175025)
* [Udacity Discussion Forums - KnockoutJS remove from observable arrays](https://discussions.udacity.com/t/knockoutjs-remove-from-observable-arrays/166692/7)