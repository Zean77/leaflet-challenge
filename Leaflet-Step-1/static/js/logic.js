var earthquake_api = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Create tile layer
var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// Create an earthquake layergroup
var earthquakeLayer = L.layerGroup();

// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "Grayscale": grayscaleMap
};

// Create map object and set default layers
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 4.5,
    layers: [grayscaleMap, earthquakeLayer]
});

// d3.json(earthquake_api, function(Data) {
//     createFeatures(Data.features);
// });

// function createFeatures(earthquake_data){
//     for (var i =0; i<earthquake_data.length; i++){
//     var depth = earthquake_data[i].geometry.coordinates[2];
//     var max = Math.max(depth);
//     console.log(max);
//     }
// }

d3.json(earthquake_api, function(earthquakeData) {
    // Function to determine marker size based on the magnitude of earthquakes
    function markerSize(magnitude){
        return magnitude * 5;
    };
    
   // Determine the marker color by depth
  function chooseColor(depth) {
    switch(true) {
      case depth >110:
        return "red";
      case depth > 90:
        return "pink";
      case depth > 70:
        return "orangered";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "gold";
      case depth > 10:
        return "yellow";
      default:
        return "lightgreen";
    }
  }
  // Create a GeoJSON layer containing the features array
  // Each feature a popup describing the place and time of the earthquake
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.75,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
      + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakeLayer);
  // Sending our earthquakes layer to the createMap function
  earthquakeLayer.addTo(myMap);
   
   // Add legend
   var legend = L.control({position: "bottomright"});
   legend.onAdd = function() {
     var div = L.DomUtil.create("div", "info legend"),
     depth = [-10, 10, 30, 50, 70, 90, 110];
     
     div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
   for (var i =0; i < depth.length; i++) {
     div.innerHTML += 
     '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
         depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
       }
     return div;
   };
   legend.addTo(myMap);
});
