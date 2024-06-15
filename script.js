stateUrl = 'http://127.0.0.1:5000/api/v1.0/states'

var map = L.map('map').setView([37.8, -96], 4);

var geojson;

var geojson2;

var info = L.control();

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function style2(feature) {
    return {
        fillColor: 'white',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function highlightFeature2(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update2(layer.feature.properties.NAME);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function resetHighlight2(e) {
    geojson.resetStyle(e.target);
    info.update2();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

    layer.bindPopup('<h4>' + feature.properties.name + '</h4>' +
                    '<p>Density: ' + feature.properties.density + ' people / mi<sup>2</sup></p>'+
                    '<p>Population: ' + feature.properties.Population + ' people </p>');
}

function onEachFeature2(feature, layer) {
    layer.on({
        mouseover: highlightFeature2,
        mouseout: resetHighlight2,
        click: zoomToFeature
    });

    layer.bindPopup('<h4>' + feature.properties.NAME + '</h4>' +
                    '<p>Census Area: ' + feature.properties.CENSUSAREA + ' mi<sup>2</sup></p>');
}

function buildStatedata(sample) {
    d3.json(stateUrl).then((data) => {
  
    // get the metadata field
    const metaDataField = data.features

    // Filter the metadata for the object with the desired sample number
    let desiredSample = metaDataField.filter(object => object.properties.name == sample)
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata1')
    let panel2 = d3.select('#sample-metadata2')
    let panel3 = d3.select('#sample-metadata3')
    let panel4 = d3.select('#sample-metadata4')

    // Use `.html("") to clear any existing metadata
    panel.html("")
    panel2.html("")
    panel3.html("")
    panel4.html("")
    
    factList =[]
    let newThing = Object.entries(desiredSample[0].properties)
    newThing.forEach(([key, value]) => {
        factList.push(key)
        factList.push(value)
    })
    panel.append("p")
        .text(`${factList[1]}`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);
    
    panel2.append("p")
        .text(`${factList[3]}`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);

    // Object.entries(newThing).forEach(([key, value]) => {
    //         panel.append("p")
    //             .text(`${key}: ${value}`)
    //             .style('opacity', 0)
    //             .transition()
    //             .duration(500)
    //             .style('opacity', 1);
    //     });
      });
    
  }

  function init() {
    d3.json(stateUrl).then((data) => {
      // Get the names field
      const namesField = []
      for (state of data.features){
        namesField.push(state.properties.name)
      }
  
      // Use d3 to select the dropdown with id of `#selDataset`
      let dropdownMenu = d3.select("#selDataset")
  
      // Use the list of sample names to populate the select options
      // Hint: Inside a loop, you will need to use d3 to append a new
      // option for each sample name.
      dropdownMenu.selectAll("option")
          .data(namesField)
          .enter()
          .append("option")
          .text(d => d)
          .attr("value", d => d);
  
      // Get the first sample from the list
      const firstName = namesField[0]
  
      // Build charts and metadata panel with the first sample
      buildStatedata(firstName)
    });
}

// Function for event listener
function optionChanged(newSample) {
    // Build charts and metadata panel each time a new sample is selected
    buildStatedata(newSample);
    
}

init()

d3.json(stateUrl).then(data =>{

    geojson2 = L.geoJson(usCounties, {
        style: style,
        onEachFeature: onEachFeature2
    }).addTo(map);

    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    
    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>US Map</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            : 'Hover over a state');
        };
        
        // method that we will use to update the control based on feature properties passed
    info.update2 = function (name) {
        this._div.innerHTML = '<h4>US Map</h4>' +  (name ?
            '<b>' + name + '</b><br />' + name + ' people / mi<sup>2</sup>'
            : 'Hover over a county');
        };
        
    info.addTo(map);
    
    let baseMaps = {
        "Street Map": tiles
    };
    
    const overlayMaps = {
        States: geojson,
        Counties: geojson2,
    };
    
    // Create a layer control that contains our baseMaps.
    let layerControl = L.control.layers(baseMaps, overlayMaps, {
        collapsed: false,
    });
    layerControl.addTo(map);
    
    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
        
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];
        
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        
        return div;
    };
    
    legend.addTo(map);
    
    // Styling for the top ID number block
    let idPanel = d3.select('.card')
    idPanel.transition().duration(500)

    Plotly.newPlot('chart1', [{
        x: ['Oct 2019', 'Nov 2019', 'Dec 2019', 'Jan 2020', 'Feb 2020', 'Mar 2020'],
        y: [500, 1500, 3000, 2500, 2000, 4500],
        type: 'bar',
        name: 'Covid Cases'
    }, {
        x: ['Oct 2019', 'Nov 2019', 'Dec 2019', 'Jan 2020', 'Feb 2020', 'Mar 2020'],
        y: [200, 800, 1200, 900, 500, 1000],
        type: 'bar',
        name: 'GDP'
    }], {
        barmode: 'group'
    });

    Plotly.newPlot('chart2', [{
        x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        y: [4.0, 4.1, 4.2, 4.3, 4.5, 4.6, 4.8, 5.0, 5.1, 5.3, 5.4, 5.5],
        type: 'line'
    }]);

})

