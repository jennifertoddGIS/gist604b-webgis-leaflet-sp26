//Initialize map
const map = L.map('map').setView([61.167402, -149.865522], 10);

//Add basemap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//Add/customize controls
//Move zoom buttoms
map.zoomControl.setPosition('topright');

//Add scale bar
L.control.scale().addTo(map);   

//Create layer groups
const parksLayer = L.layerGroup().addTo(map);
const trailsLayer = L.layerGroup().addTo(map);
const trailpostsLayer = L.layerGroup().addTo(map);

//UI control to toggle layers
L.control.layers(null, {
    'Parks': parksLayer,
    'Trails': trailsLayer,
    'Trail Posts': trailpostsLayer
}).addTo(map);

//Load point data (trail posts)
fetch('data/trailposts.geojson')
    .then(res => res.json())
    .then(data => {L.geoJSON(data, {
        //Style points as circle markers
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 6,
                fillColor: "blue",
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        
        //Add popups 
        onEachFeature: function(feature, layer) {
            const name = feature.properties.name || "Trail Post";
            layer.bindPopup(`<strong>${name}</strong>`);
        }
    }).addTo(trailpostsLayer);
    })
    .catch(err => console.error('Error loading trail posts:', err));

//Load line data (trails)
fetch('data/trails.geojson')
    .then(res => res.json())
    .then(data => {L.geoJSON(data, {
            
        //Style lines
            style: function(feature) {
                return {
                    color: "darkblue",
                    weight: 3,
                    opacity: 0.7
                };
            },

            //Add popups
            onEachFeature: function(feature, layer) {
                const name = feature.properties.name || "Trail";
                layer.bindPopup(`<strong>${name}</strong>`);
            }
        }).addTo(trailsLayer);
    })
    .catch(err => console.error('Error loading trails:', err));

//Load polygon data (parks)
fetch('data/parks.geojson')
    .then(res => res.json())
    .then(data => {L.geoJSON(data, {
        //Style polygons
        style: function() {
            return {
                color: "green",
                weight: 2,
                opacity: 0.6,
                fillColor: "lightgreen",
                fillOpacity: 0.4
            };
        },

        //Add popups
        onEachFeature: function(feature, layer) {
            const name = feature.properties.name || "Park";
            layer.bindPopup(`<strong>${name}</strong>`);
        }
    }).addTo(parksLayer);
    })
    .catch(err => console.error('Error loading parks:', err));
