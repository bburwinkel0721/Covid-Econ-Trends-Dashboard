// Grab our api links for the data
stateUrl = 'http://127.0.0.1:5000/api/v1.0/states'
countyUrl = 'http://127.0.0.1:5000/api/v1.0/counties'

// Creating some initial variables
var map = L.map('map').setView([37.8, -96], 4);
var geojson;
var geojson2;
var info = L.control();
var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Changes the map coloring based on population denstiny
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

// Styles the states
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

// Styles the counties
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

// Highlights the states
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

// Highlights the counties
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

// resets the highlighting on each state
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

// resets the highlighting on each county
function resetHighlight2(e) {
    geojson.resetStyle(e.target);
    info.update2();
}

// Zooms in on whatever is selected on the map
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// Applies the functions to the states layer
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

    layer.bindPopup('<h4>' + feature.properties.name + '</h4>' +
                    '<p>Popultion Density: ' + feature.properties.density + '</p>'+
                    '<p>Total Covid Cases: ' +  ' people </p>');
}

// Applies the functions to the counties layer
function onEachFeature2(feature, layer) {
    layer.on({
        mouseover: highlightFeature2,
        mouseout: resetHighlight2,
        click: zoomToFeature
    });

    layer.bindPopup('<h4>' + feature.properties.NAME + '</h4>' +
                    '<p>Census Area: ' + feature.properties.CENSUSAREA + ' mi<sup>2</sup></p>');
}

// Builds the state specific elements
function buildStatedata(state, year) {
    d3.json(stateUrl).then((data) => {
  
    // get the metadata field
    const metaDataField = data.features

    // Filter the metadata for the object with the desired state
    let desiredState = metaDataField.filter(object => object.properties.name == state)
    
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
    
    // Get properties from the selected state
    let propertiesList =[]
    Object.entries(desiredState[0].properties).forEach(([key, value]) => {
        propertiesList.push(value)
    })
    let populationDataList = []
    Object.entries(propertiesList[2]).forEach(([key, value]) => {
        populationDataList.push(value)})
    let popAndYearList = []
    Object.entries(populationDataList).forEach(([key, value]) => {
        popAndYearList.push(value)})
    for (let i=0; i<popAndYearList.length; i++){
        if (popAndYearList[i].year==year){
            panel.append("p")
                .text(`${popAndYearList[i].Population} People`)
                .style('opacity', 0)
                .transition()
                .duration(500)
                .style('opacity', 1);
        }
    }

    // Get umemployment data by year
    let unemploymentRatesByMonth = []
    for (let month of propertiesList[3]){
        if (month.year == year){
            unemploymentRatesByMonth.push(month.value)
        }
        
    }

    // Send unemployment data to be graphed
    buildCharts(unemploymentRatesByMonth)

    // Get the sum of the unemployment rates
    const sum = unemploymentRatesByMonth.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Calculate the unemployment average
    const average = sum / unemploymentRatesByMonth.length;

    // Add unemployment average to panel 2
    panel2.append("p")
        .text(`${average.toFixed(1)}%`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);
    
    // New Covid Cases data by year
    let newCovidCaseByMonth =[]
    for (let cases of propertiesList[0]){
            if (cases.year == year){
                newCovidCaseByMonth = cases['New Cases']
            }
        }
    
    // 
    buildCharts2(unemploymentRatesByMonth, newCovidCaseByMonth)
    
    // Get the sum of the new coivd cases that year
    const sumCovidCases = newCovidCaseByMonth.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Add Covid Cases total to panel 3
    panel3.append("p")
        .text(`${sumCovidCases}`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);

    // New Covid Cases data by year
    let newCovidDeathsByMonth =[]
    for (let cases of propertiesList[1]){
            if (cases.year == year){
                newCovidDeathsByMonth = cases['New Deaths']
            }
        }
    
    
    // Get the sum of the new coivd cases that year
    const sumCovidDeaths = newCovidDeathsByMonth.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Add Covid deaths total to panel 4
    panel4.append("p")
        .text(`${sumCovidDeaths}`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);
    });

    

  }
  
  // function for build charts
  function buildCharts(data){
    let yValues = data.reverse()
    Plotly.newPlot('chart2', [{
        x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        y: yValues,
        type: 'line'
    }]);
  }

  function buildCharts2(data, covid){
    let yValues = data.reverse()
    Plotly.newPlot('chart1', [{
        x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        y: covid,
        type: 'bar',
        name: 'Covid Cases'
    }, {
        x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        y: yValues,
        type: 'bar',
        name: 'Unemployment'
    }], {
        barmode: 'group'
    });
  }
  
  // initilize the dropdown menus
  function init() {
    d3.json(stateUrl).then((data) => {
      // Get the names field
      const namesField = []
      for (state of data.features){
        namesField.push(state.properties.name)
      }
      
      // List of the years in data
      const yearField =[2020,2021,2022,2023]

      // Use d3 to select the dropdowns by id
      let dropdownMenu = d3.select("#selDataset")
      let dropdownMenu2 = d3.select("#selYear")
  
      // Use the list of state names to populate the select options
      dropdownMenu.selectAll("option")
          .data(namesField)
          .enter()
          .append("option")
          .text(d => d)
          .attr("value", d => d);

      // Use the list of the years to populate the select options
      dropdownMenu2.selectAll("option")
          .data(yearField)
          .enter()
          .append("option")
          .text(d => d)
          .attr("value", d => d);
  
      // Get the first item from each list
      const firstName = namesField[0]
      const firstYear = yearField[0]
  
      // Build state specific data
      buildStatedata(firstName, firstYear)
    });
}

// Function for event listener if state is changed
function optionChangedState(newState) {
    let year = document.getElementById("selYear").value
    // Build state specific data
    buildStatedata(newState, year);
    
}

// Function for event listener if year is changed
function optionChangedYear(newYear) {
    let state = document.getElementById("selDataset").value
    // Build state specific data
    buildStatedata(state, newYear);
    
}

init()

d3.json(stateUrl).then(data =>{
    d3.json(countyUrl).then(countiesData=> {
        
        geojson2 = L.geoJson(countiesData, {
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
                    '<b>' + name + '</b><br />'
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
                
                // Plotly.newPlot('chart1', [{
                //     x: ['Oct 2019', 'Nov 2019', 'Dec 2019', 'Jan 2020', 'Feb 2020', 'Mar 2020'],
                //     y: [500, 1500, 3000, 2500, 2000, 4500],
                //     type: 'bar',
                //     name: 'Covid Cases'
                // }, {
                //     x: ['Oct 2019', 'Nov 2019', 'Dec 2019', 'Jan 2020', 'Feb 2020', 'Mar 2020'],
                //     y: [200, 800, 1200, 900, 500, 1000],
                //     type: 'bar',
                //     name: 'GDP'
                // }], {
                //     barmode: 'group'
                // });


                
                // Plotly.newPlot('chart2', [{
                //     x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                //     y: [4.0, 4.1, 4.2, 4.3, 4.5, 4.6, 4.8, 5.0, 5.1, 5.3, 5.4, 5.5],
                //     type: 'line'
                // }]);
            })

})

