# Udacity FSND Project Neighborhood Map  #
This project is connected to the _Full Stack Web Developer Nanodegree Program_ course by **Udacity**.

**This single page web application** takes a list of addresses (  locations ) and shows location related information like:
  - Google Map
  - Address Info with Foursquare API call
## Install ##
All project files are delivered in a zip file.
```
    my-city-map.zip
```
After unzip this file you will get a folder and subfolder with following files:
* css 
    * bootstrap-theme.min.css
    * bootstrap.min.css
    * style.css
* fonts
    * glyphicons-halflings-regular.eot
    * glyphicons-halflings-regular.svg
    * glyphicons-halflings-regular.ttf
    * glyphicons-halflings-regular.woff
    * glyphicons-halflings-regular.woff2
* img
    * udacity-logo
* index.html
* js
    * app.js
    * foursquare_client.js
    * bootstrap.min.js
    * jquery.min.js
    * knockout-3.2.0.js
    * travel-locations-data.js
* README.md
## Environment ##
This program runs on any standard web browser. It requires internet connection to get location related information from Google Map API Services NS  Foursquare API call
## Tools ##
Following tools are used in this application and are delived with the packed zip file.
  - jQuery v1.11.1
  - Bootstrap v3.3.7
  - Knockout JavaScript library v3.2.0


## Initial Test Data ##
Test data are delivered in following file:
```
travel-locations-data.js
```

```
var travelLocations = [
    {
        country : 'Germany',
        city : 'Darmstadt',
        street : 'Luisenplatz',
        lat: 49.87282769999999,
        lng: 8.651211500000045
    },
    {
        country : 'Germany',
        city : 'Darmstadt',
        street : 'Technische Universität',
        lat: 49.874778,
        lng: 8.65614000000005
    },
    {
        country : 'Germany',
        city : 'Darmstadt',
        street : 'Marktplatz',
        lat: 49.8734461,
        lng: 8.65569460000006
    }
];
```

## Run the application ##
* change to the folder, where you have unzipped  **Neighborhood_Map.zip**
* You can put  **index.html** to your favorite browser to start this single page web application.

## Functionality ##
Here are the list of main functionality of this application
  - Application data is stored in a seperate file **travel-locations-data.js** .
  - Application has a  filter text input field. User can filter a location in the list .

## Licence ##
It is free to use only for learning purposes. 
This application requires 2 (Google API and Foursquare API) keys 
  1. edit in file foursquare_client.js clientID and  clientSecret
  2. replace in index.html the text googlemapclientkey with your key

      <script async defer
        src="https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=googlemapclientkey&v=3&callback=initApp" onerror="errorHandling()">
      </script>

