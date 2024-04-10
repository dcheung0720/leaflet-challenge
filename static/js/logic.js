d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(
    data => createMap(data)
)

const createMap = (data) =>{
    console.log(data);

    //create map
    let map = L.map('map').setView([40, -120], 7);

    //add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const maxDepth = Math.max(...data.features.map(feature => feature.geometry.coordinates[2]));
    const sorted = data.features.map(feature => feature.geometry.coordinates[2]).sort((a,b) => a - b);
    const median = sorted[Math.floor(sorted.length*.75)];

    function getColor(d) {
        return d > 500 ? '#800026' :
               d > 200  ? '#BD0026' :
               d > 20  ? '#E31A1C' :
               d > 10  ? '#FC4E2A' :
               d > 5.0   ? '#FD8D3C' :
               d > 1.0   ? '#FEB24C' :
               d > 0.5   ? '#FED976' :
                          '#FFEDA0';
    }

    function pointToLayer(feature, latlng) {
            if (feature && feature.geometry && feature.geometry.coordinates){
                const depth = feature.geometry.coordinates[2]
                const mag = feature.properties.mag;
                const geoMarkerOption = {
                    radius :  mag * 10000,
                    fillColor: getColor(depth),
                    color: `rgb(70,70,70)`,
                    opacity: .5,
                    fillOpacity: 1,
                }

                // add all the circles
                L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], geoMarkerOption).addTo(map).bindPopup(`<h3> Magnitude:${mag}</h3> 
                                                                                                                                    <h3> Depth: ${depth} </h3>        `);        
            }

    };

    // function onEachFeature(feature, layer){
    //     layer.bindPopup(feature.properties.place);

    // }

    // add geojson data
    L.geoJSON(data, {
        pointToLayer:pointToLayer
    }).addTo(map);


    // add legend
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 0.5,1.0,5.0,10,20,200,500],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            console.log(getColor(grades[i]))
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

};