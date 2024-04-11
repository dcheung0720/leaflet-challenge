d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(
    data => createMap(data)
)


const createMap = (data) =>{
    const createTectonicPlates = (map, baseMaps, earthquakeLayer) =>{
        d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(
            data => {
                //creating tectonic plates
                const tectonicsLayer = L.geoJSON(data);
            
                //adding control layer
                let overlayMaps = {
                    Earthquake: earthquakeLayer,
                    Tectonics : tectonicsLayer
                };


                //control layer
                L.control.layers(baseMaps, overlayMaps, {
                    collapsed: false
                  }).addTo(map);
            }
        )
    };

    //street layer
    const street =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    //satellite layer
    const satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
                        maxZoom: 20,
                        subdomains:['mt0','mt1','mt2','mt3']
    });

    //create map
    let map = L.map('map', {
        layers: [street, satellite]
    }).setView([40, -120], 7);

    //base maps
    const baseMaps = {
        Street: street,
        Satellite: satellite
    }

    //color function
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


    // add legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 0.5,1.0,5.0,10,20,200,500],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(map);

    // add geojson data
    const earthquakes = data.features.map(feature =>{
        const depth = feature.geometry.coordinates[2]
                const mag = feature.properties.mag;
                const location = feature.properties.place;
                const geoMarkerOption = {
                    radius :  mag * 10000,
                    fillColor: getColor(depth),
                    color: `rgb(70,70,70)`,
                    opacity: .5,
                    fillOpacity: 1,
                }

                // add all the circles
                return L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], geoMarkerOption).bindPopup(`<h3> Magnitude:${mag}</h3> 
                                                                                                                                    <h3> Depth: ${depth} </h3>
                                                                                                                                    <h3> Location: ${location} </h3>`);        
    });

    const earthquakeLayer = L.layerGroup(earthquakes)

    createTectonicPlates(map, baseMaps, earthquakeLayer);
};


