let queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Create a map object.
let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });

//Addding a tile layer (the background map image) to the map.
let grayscaleMap =L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store our API endpoint as queryUrl.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    let earthquakes = data.features;

    earthquakes.forEach(function (earthquake) {
      let coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
      let magnitude = earthquake.properties.mag;
      let depth = earthquake.geometry.coordinates[2];
      
      let MarketSize = magnitude * 5;

      let Markercolor = getColor(depth);

      // Create a marker for each earthquake.
      L.circleMarker(coordinates, {
        fillOpacity: 0.75,
        color: "#000",
        weight: 1,
        fillColor: Markercolor,
        radius: MarketSize
      }).bindPopup(`<center> <h3>${earthquake.properties.place}</h3> </center> <hr> <p> <b>  Magnitude: </b>  ${magnitude}  &nbsp;  <b>  Depth: </b>  ${depth}</p>  <p> <b> Date: </b>  ${new Date(earthquake.properties.time)} </p> <hr>  `)
        .addTo(myMap);
  });

  // Create a legend control object.
  let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let limits = [-10, 10, 30, 50, 70, 90];
    let colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'];

    // loop through our density intervals and generate a label with a colored square for each interval.
    for (var i = 0; i < limits.length; i++) {
      div.innerHTML +=
        '<i style="background-color:' + colors[i] + '"></i>'+
        limits[i] + (limits[i + 1]? '&ndash;' + limits[i + 1] + '<br>' : '+');
  }
    return div;
  };
  
    // Define the getColor function to calculate the color of the circle based on the magnitude of the earthquake.
    function getColor(depth) {
        switch (true) {
          case depth  > 90:
            return '#d73027';
          case depth  > 70:
            return '#fc8d59';
          case depth  > 50:
            return '#fee08b';
          case depth  > 30:
            return '#d9ef8b';
          case depth  > 10:
            return '#91cf60';
          default:
            return '#1a9850';
        }
      }
    }).addTo(myMap);
  legend.addTo(myMap);

// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

