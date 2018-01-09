/**
 * Modul app.js
 * Udacity Project Neighborhood Map
 */

/**
* Global Variables
*/
var map; // for google map instance.
var markers = [];
var selectedLocationId = 0;
var mouseoverMarkerIcon ;
var selectedMarkerIcon;
var defaultMarkerIcon ;
var viewModel ;
var largeInfowindow;

/**
* @description This function creates a new google map marker icon
* @param {Color} markerColor - Color code 
* @return {google.maps.MarkerImage} markerImage - New marker icon
*/
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'
      + markerColor 
      + '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
}

/**
* @description This function implements the Google Map API call .
* It loads related Google Map and binds to the tab view
* @param {ViewModel} vm - Instance of ViewModel , which contains live application data.
*/
function initMap(vm) {

    var data =  vm.currentTravelLocation();

    var bounds = new google.maps.LatLngBounds();
 //   var largeInfowindow = new google.maps.InfoWindow();
    largeInfowindow = new google.maps.InfoWindow();

    mouseoverMarkerIcon = makeMarkerIcon('0D47A1');
    selectedMarkerIcon = makeMarkerIcon('FFEB3B');
    defaultMarkerIcon = makeMarkerIcon('FF5722');

    var location = {
        lat: data.lat(), 
        lng: data.lng()
    };

    map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 14
    });


    for (var i = 0; i < vm.travelLocationList().length; i++) {

        var item = vm.travelLocationList()[i];

            var location = {
                lat: item.lat(), 
                lng: item.lng()
            };

            var marker = new google.maps.Marker({
              position: location,
              map: map,
              title: item.locationStr(),
              lat: location.lat,
              lng: location.lng,
              animation: google.maps.Animation.DROP,
              id: i
            });

            
            if(item.visible() == false){
                marker.visible = false;
            }
            else{
                marker.visible = true;
            }

            markers.push(marker);
            bounds.extend(markers[i].position);

            marker.addListener('click', function() {

                map.setCenter(marker.getPosition());

                showInfoWindow(this, largeInfowindow);

                this.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout((function() {
                    this.setAnimation(null);
                }).bind(this), 1000);

                var selectedLocation = viewModel.travelLocationList()[this.id];
                viewModel.setMarkerCurrentTravelLocation(selectedLocation);
            });

            if( i === selectedLocationId ){
                marker.setIcon(selectedMarkerIcon); 
            }else{
                marker.setIcon(defaultMarkerIcon);     
            }

            marker.addListener('mouseover', function() {
                this.setIcon(mouseoverMarkerIcon);
            });
            marker.addListener('mouseout', function() {
                if( this.id === selectedLocationId ){
                    this.setIcon(selectedMarkerIcon); 
                }else{
                    this.setIcon(defaultMarkerIcon);
                }
            });
    };
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

}

/**
* @description This function implements info view events for google map marker .
* @param {google.maps.Marker} marker - Instance map marker
* @param {google.maps.InfoWindow} infowindow - Instance map info window
*/
function showInfoWindow(marker, infowindow) {

    if (infowindow.marker != marker) {

        infowindow.setContent('');
        infowindow.marker = marker;

        // URL for Foursquare API
        var title =  marker.title.replace(" ", "&");
        var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
            marker.lat + ',' + marker.lng + '&client_id=' + clientID +
            '&client_secret=' + clientSecret + '&query=' + title +
            '&v=20170708' + '&m=foursquare';

        // Foursquare API
        $.getJSON(apiUrl).done(function(marker) {

             var response = marker.response.venues[0];
            self.street = response.location.address;
            self.postalCode = response.location.postalCode;
            self.city = response.location.city;
            self.country = response.location.country;

            self.htmlContentFoursquare =
                    '<address class="well">' + 
                        '<strong>' + 'Address : ' + '</strong> <br>' +
                        '<p>' + self.street + '</p>' +
                        '<p>' + self.postalCode + ' ' + self.city + '</p>' +
                        '<p>' + self.country + '</p>' +
                    '</address>' ;   

            infowindow.setContent(  self.htmlTitle + self.htmlContentFoursquare );

        }).fail(function() {
            alert(
                "There was an issue loading the Foursquare API."
            );
        });
        
        this.htmlTitle = '<div>' + '<h6>' + marker.title + '</h6>' + '</div>' ;
        infowindow.open(map, marker);

        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

/**
* @description Represents a Travel Location Object for the Aplication
* TravelLocation contains knockout observables. Thes attributes  of this object are bind
* to the view elements.
* @param {TravelLocationItem} data - One Item of  travelLocations json array object
*/
function TravelLocation(data){

    this.country = ko.observable(data.country);
    this.city = ko.observable(data.city);
    this.street = ko.observable(data.street);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);

    this.streetviewURL = ko.observable(null);
    this.msg = ko.observable('');

    this.id = 0;

    this.visible = ko.observable(true);

    this.locationStr = ko.computed(function() {
        return this.street() + ' ' + this.city() + ' ' + this.country();
    }, this);

}

/**
* @description Filters the locations in the list and change visibility
*/
function filterLocations(text){
    // travelLocation.visible(false);
    for (var i = 0; i < viewModel.travelLocationList().length; i++) {

        var item = viewModel.travelLocationList()[i];
        var marker = markers[i];
        
        if(text === ''){
                item.visible(true);
                marker.setVisible(true);
        } else{
            if (item.street().toLowerCase().includes(text.toLowerCase())) {
                item.visible(true);
                marker.setVisible(true);
            } else {
                item.visible(false);
                marker.setVisible(false);
            }
        }
    };
}

/**
* @description Represents the application ViewModel for knockout libary
* "Neighborhood Map Application" data are stored in modul 
* 'trave-locations-data.js' as json aray objects 'travelLocations'.
* ViewModel reads these data and binds them as observableArray to 
* view elements in index.html
* The interaction between view elements and application is done in this modul.
*/
function ViewModel() {

    var self = this;

    this.travelLocationList = ko.observableArray([]);
    // read all travel locations and create a observableArray with them
    var id = 0;
    travelLocations.forEach( function(travelLocationItem){
        var travelLocation = new TravelLocation(travelLocationItem);
        travelLocation.id = id;
        self.travelLocationList.push( travelLocation );
        id += 1;
    });

    // set focus ( selected item ) to the first travel locations 
    this.currentTravelLocation = ko.observable( this.travelLocationList()[0] );

    selectedLocationId = 0;
    
    this.largeInfowindow = null;

    // filter variables
    this.filterText = ko.observable('');

    initMap(self);


    // on click function for the location selection from list
    // changes currentTravelLocation to the new selected item
    this.setCurrentTravelLocation = function(clickedTravelLocation){

        // set Marker Icon from current  to default
        var marker = markers[selectedLocationId];
        marker.setIcon(defaultMarkerIcon); 

        // new selection for the location in the list
        self.currentTravelLocation(clickedTravelLocation);

        // set selectedLocation Id to the new selection
        selectedLocationId = self.currentTravelLocation().id;

        // set Marker Icon from current selected to default
        marker = markers[selectedLocationId];
        marker.setIcon(selectedMarkerIcon);   

        showInfoWindow(marker, largeInfowindow); 

    };

    // on click function for the Marker selection
    this.setMarkerCurrentTravelLocation = function(clickedTravelLocation){

        // set Marker Icon from current  to default
        var marker = markers[selectedLocationId];
        marker.setIcon(defaultMarkerIcon); 

        // new selection for the location in the list
        self.currentTravelLocation(clickedTravelLocation);

        // set selectedLocation Id to the new selection
        selectedLocationId = self.currentTravelLocation().id;

    };

}

/**
* @description Handles  error by Google Map API async call . 
*/
function errorHandling() {
    alert('An error occurred on  Google Map API!');
}

/**
* @description Application Starting Entry Poing. 
* Instanciates ViewModel and activates "knockout apppBindings".
*/
function initApp() {

    viewModel = new ViewModel();
    ko.applyBindings(viewModel);

    viewModel.filterTextLive = ko.dependentObservable(function () {

        filterLocations(viewModel.filterText());

    },viewModel);

}
