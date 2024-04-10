d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(
    data => createMap(data)
)

const createMap = (data) =>{
    console.log(data);

    //create map
    let map = L.map('map').setView([40, -100], 3);

    //add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const maxDepth = Math.max(...data.features.map(feature => feature.geometry.coordinates[2]));

    function pointToLayer(feature, latlng) {
            if (feature && feature.geometry && feature.geometry.coordinates){
                const normalizedColorR = feature.geometry.coordinates[2]/maxDepth * 255 / 2;
                const normalizedColorG = 200;
                const normalizedColorB = feature.geometry.coordinates[2]/maxDepth * 255 / 2;
                const geoMarkerOption = {
                    radius :  feature.properties.mag * 10000,
                    fillColor: `rgb(${normalizedColorR},${normalizedColorG},${normalizedColorB})`,
                    color: `rgb(70,70,70)`,
                    opacity: .5,
                    fillOpacity: 1
                }

                L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], geoMarkerOption).addTo(map);        
            }

    };

    // add geojson data
    L.geoJSON(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};