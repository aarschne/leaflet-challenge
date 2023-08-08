// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
function createFeatures(earthquakeData) {

    console.log(earthquakeData);
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
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

function getColorInd(d) {
    return "#FF0000";
}

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
    
    var legend = L.control({
        position: 'bottomright'
    });
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            labels = ['<strong>index</strong>'],
            limits = ["<5", "5 to <10", "10 to <15", ">15"];
            colors = ["green", "yellow" ,"orange", "red"]
    
        for (var i = 0; i < limits.length; i++) {
            div.innerHTML += labels.push(
                '<i class = "circle" style="background:' + colors[i] + '"></div>' + limits[i]);
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    
    legend.addTo(myMap);

}