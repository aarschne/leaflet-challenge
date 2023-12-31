// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
function selectColor(value){
    if (value > 15){
        return "red"
    }
    else if (value >= 10){
        return "orange"
    }
    else if (value >= 5){
        return "yellow"
    }
    else {
        return "green"
    };
};

function createFeatures(earthquakeData) {

    console.log(earthquakeData);
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the magnitude, place, and depth of each earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Magnitude is: ${feature.properties.mag}</h3> 
        <hr><p>Location is: ${feature.properties.place}</p> <hr><p>Depth is: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // create a geojson layer
    let earthquakes = L.geoJSON(earthquakeData, {
        style: function(feature) {
            var depth = feature.geometry.coordinates[2];
            if (depth > 15.0) {
              return { color: "red" }; 
            } 
            else if (depth >= 10.0) {
              return { color: "orange" };
            } 
            else if (depth >= 5.0) {
              return { color: "yellow" };
            } 
            else {
              return { color: "green" };
            }
          },
          pointToLayer: function(feature, coords) {
            return L.circleMarker(coords, {
              radius: Math.round(feature.properties.mag) * 4,
            });
          },
        onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

  // Getting our GeoJSON data
  d3.json(link).then(function(data) {
    createFeatures(data.features);
});

function createMap(earthquakes) {

    // Create the base layer.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [earthquakes, street]
    });

    // create legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-5, 5, 10, 15],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + selectColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// add legend to map
legend.addTo(myMap);
}