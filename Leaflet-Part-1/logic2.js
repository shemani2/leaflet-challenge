function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(
        `<h3>${feature.properties.place}</h3><hr><p>${new Date(
          feature.properties.time
        )}</p>`
      );
    }
    function magRadius(mag) {
      if (mag == 0) {
        return 1;
      }
      return mag * 6;
    }
    function getColor(x) {
      switch (true) {
        case x > 90:
          return "red";
        case x > 70:
          return "orangered";
        case x > 50:
          return "orange";
        case x > 30:
          return "yellow";
        case x > 10:
          return "yellowgreen";
        default:
          return "green";
      }
    }
  
    function getStyle(feature) {
      return {
        color: "black",
        weight: 0.3,
        fillOpacity: 0.75,
        radius: magRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
      };
    }
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: getStyle,
      onEachFeature: onEachFeature,
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
  
    let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes,
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes],
    });
  
    // Add legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend"),
        x = [-10, 10, 30, 50, 70, 90];
  
      div.innerHTML += "<h3 style='text-align: center'>x</h3>";
  
      for (var i = 0; i < x.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getColor(x[i] + 1) +
          '"></i> ' +
          x[i] +
          (x[i + 1] ? "&ndash;" + x[i + 1] + "<br>" : "+");
      }
      return div;
    };
    legend.addTo(myMap);
  }