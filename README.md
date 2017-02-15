# Neighborhood Map

As project 5 for the Front-End Web Developer Nanodegree, I built a responsive website that will display a map where some markers will identify
locations a user is interested in.

## Getting Started

To view the website, download a copy of the project to your local machine and open the file index.html with your browser.

## Built With

* [Bootstrap](http://getbootstrap.com/) - The web framework used
* [Google Maps API](https://developers.google.com/maps/web/) - The map API used
* [jQuery](http://jquery.com/) - A JavaScript library for simpler HTML manipulation and event handling

## Author

* **Daniele Erbì** - [daniel-234](https://github.com/daniel-234)

## Notes

The app will display 1 location in Cagliari (IT) when the page loads.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* I relied on some answers on Stackoverflow and an article to make the map set center and bounds dynamically based on markers and viewport change
* [Stackoverflow - Center/Set Zoom of Map to cover all visible Markers?](http://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers)
* [Stackoverflow - Google Map API v3 - set bounds and center](http://stackoverflow.com/questions/1556921/google-map-api-v3-set-bounds-and-center?rq=1)
* [Learn Tech - Google Maps API v3: Capturing viewport change - use "idle" not "bounds_changed"](https://learntech.imsu.ox.ac.uk/blog/?p=861)
* [Stackoverflow - Google Map event bounds_changed triggered multiple times when draggered](http://stackoverflow.com/questions/4338490/google-map-event-bounds-changed-triggered-multiple-times-when-dragging)
* To refactor the code to make use of the JavaScript library KnockoutJS, I used the following resources:
* [KnockoutJS documentation](http://knockoutjs.com/documentation/introduction.html)
* [Mastering KnockoutJS - by Timothy Moran](https://www.packtpub.com/web-development/mastering-knockoutjs)
* [Stackoverflow - How to display a Google map with Knockout js and HTML](http://stackoverflow.com/questions/39417762/how-to-display-a-google-map-with-knockout-js-and-html)
* [Stackoverflow - Why am I getting a "Cannot read property 'nodeType' of null" error with Knockout JS?](http://stackoverflow.com/questions/15090015/why-am-i-getting-a-cannot-read-property-nodetype-of-null-error-with-knockout)
* To handle the two Views on the same page and the different ViewModels, I relied on this answer on Stackoverflow.
* [Stackoverflow - Example of knockout js pattern for multi-view applications](http://stackoverflow.com/questions/8676988/example-of-knockoutjs-pattern-for-multi-view-applications/8680668#8680668)
* To understand the Custom Bindings feature of KnockoutJS I read several articles and some book paragraphs. The most important for adapting it to my needs were:
* [Mastering KnockoutJS - by Timothy Moran](https://www.packtpub.com/web-development/mastering-knockoutjs)
* [Another look at Custom Bindings for KnockoutJS - KnockMeOut](http://www.knockmeout.net/2011/07/another-look-at-custom-bindings-for.html)
* [JSFiddle - Knockout custom binding with multiple parameters](https://jsfiddle.net/NathanFriend/sectn9va/)