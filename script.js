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

// Changes the map coloring for states based on covid cases
function getColorStates(d) {
    return d > 2000000 ? '#800026' :
           d > 1500000 ? '#BD0026' :
           d > 1000000 ? '#E31A1C' :
           d > 750000  ? '#FC4E2A' :
           d > 500000  ? '#FD8D3C' :
           d > 400000  ? '#FEB24C' :
           d > 300000  ? '#FED976' :
           d > 200000  ? '#FFEDA0' :
                          '#FFFFCC' ;
}

// Changes the map coloring for counties based on covid cases
function getColorCounty(d) {
    return d > 200000 ? '#800026' :
           d > 150000 ? '#BD0026' :
           d > 100000 ? '#E31A1C' :
           d > 75000  ? '#FC4E2A' :
           d > 50000  ? '#FD8D3C' :
           d > 40000  ? '#FEB24C' :
           d > 30000  ? '#FED976' :
           d > 20000  ? '#FFEDA0' :
           d > 15000  ? '#FFFFCC' :
           d > 10000  ? '#E0F3F8' :
           d > 7500   ? '#BAE4BC' :
           d > 5000   ? '#7BCCC4' :
                      '#43A2CA';
}

// Styles the states
function styleStates(feature) {
    let cases2020 = feature.properties['Covid Confirmed'][0]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2021 = feature.properties['Covid Confirmed'][1]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2022 = feature.properties['Covid Confirmed'][2]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2023 = feature.properties['Covid Confirmed'][3]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    let totalCaseCount = cases2020+cases2021+cases2022+cases2023
    return {
        fillColor: getColorStates(totalCaseCount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Styles the counties
function styleCounties(feature) {
    let cases2020 = feature.properties['Covid Confirmed'][0]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2021 = feature.properties['Covid Confirmed'][1]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2022 = feature.properties['Covid Confirmed'][2]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2023 = feature.properties['Covid Confirmed'][3]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    let totalCaseCount = cases2020+cases2021+cases2022+cases2023
    return {
        fillColor: getColorCounty(totalCaseCount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Highlights the states
function highlightFeatureState(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.updateState(layer.feature.properties);
}

// Highlights the counties
function highlightFeatureCounty(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.updateCounty(layer.feature.properties.NAME);
}

// resets the highlighting on each state
function resetHighlightState(e) {
    geojson.resetStyle(e.target);
    info.update();
}

// resets the highlighting on each county
function resetHighlightCounty(e) {
    geojson2.resetStyle(e.target);
    info.update2();
}

// Zooms in on whatever is selected on the map
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// Applies the functions to the states layer
function onEachFeatureState(feature, layer) {
    layer.on({
        mouseover: highlightFeatureState,
        mouseout: resetHighlightState,
        click: zoomToFeature
    });

    // Grab covid cases for each year
    let cases2020 = feature.properties['Covid Confirmed'][0]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2021 = feature.properties['Covid Confirmed'][1]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2022 = feature.properties['Covid Confirmed'][2]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2023 = feature.properties['Covid Confirmed'][3]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    // Total the cases up
    let totalCaseCount = cases2020+cases2021+cases2022+cases2023

    // Create popup for each state
    layer.bindPopup('<h4>' + feature.properties.name + '</h4>' +
                    '<p>Popultion Density: ' + feature.properties.density + '</p>'+
                    '<p>Total Covid Cases From January 2020 to Febuary 2023: ' + totalCaseCount + ' people </p>');
}

// Applies the functions to the counties layer
function onEachFeatureCounty(feature, layer) {
    layer.on({
        mouseover: highlightFeatureCounty,
        mouseout: resetHighlightCounty,
        click: zoomToFeature
    });

    // Grab covid cases for each year
    let cases2020 = feature.properties['Covid Confirmed'][0]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2021 = feature.properties['Covid Confirmed'][1]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2022 = feature.properties['Covid Confirmed'][2]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    let cases2023 = feature.properties['Covid Confirmed'][3]['New Cases'].reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    // Total the cases up
    let totalCaseCount = cases2020+cases2021+cases2022+cases2023

    // Create popup for each county
    layer.bindPopup('<h4>' + feature.properties.NAME + '</h4>' +
                    '<p>Census Area: ' + feature.properties.CENSUSAREA + ' mi<sup>2</sup></p>'+
                    '<p>Total Covid Cases From January 2020 to Febuary 2023: ' + totalCaseCount + ' people </p>');
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
    let panel5 = d3.select('#sample-metadata5')
    let panel6 = d3.select('#sample-metadata6')

    // Use `.html("") to clear any existing metadata
    panel.html("")
    panel2.html("")
    panel3.html("")
    panel4.html("")
    panel5.html("")
    panel6.html("")
    
    // Get properties from the selected state
    let propertiesList =[]
    Object.entries(desiredState[0].properties).forEach(([key, value]) => {
        propertiesList.push(value)
    })

    // Get the population data by year
    let populationDataList = []
    Object.entries(propertiesList[3]).forEach(([key, value]) => {
        populationDataList.push(value)})
    let popAndYearList = []
    Object.entries(populationDataList).forEach(([key, value]) => {
        popAndYearList.push(value)})
    for (let i=0; i<popAndYearList.length; i++){
        if (popAndYearList[i].year==year){
            // Add population to panel 1
            panel.append("p")
                .text(`${(popAndYearList[i].Population).toLocaleString()}`)
                .style('opacity', 0)
                .transition()
                .duration(500)
                .style('opacity', 1)
                .style("font-family", "Arial")
                .style("font-size", "25px")
                .style("font-weight", "bold")
                .style("color", "purple");
        }
    }

    
    // Get umemployment data by year
    let unemploymentRatesByMonth = []
    for (let month of propertiesList[4]){
        if (month.year == year){
            unemploymentRatesByMonth.push(month.value)
        }
        
    }
    unemploymentRatesByMonth.reverse()
    
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
        .style('opacity', 1)
        .style("font-family", "Arial")
        .style("font-size", "25px")
        .style("font-weight", "bold")
        .style("color", "black");

    // New Covid Cases data by year
    let newCovidCaseByMonth =[]
    for (let cases of propertiesList[0]){
            if (cases.year == year){
                newCovidCaseByMonth = cases['New Cases']
            }
        }

    // 
    buildCharts2(newCovidCaseByMonth)
        
    // Get the sum of the new coivd cases that year
    const sumCovidCases = newCovidCaseByMonth.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Add Covid Cases total to panel 3
    panel3.append("p")
        .text(`${sumCovidCases.toLocaleString()}`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1)
        .style("font-family", "Arial")
        .style("font-size", "25px")
        .style("font-weight", "bold")
        .style("color", "blue");


    // New Covid Cases data by year
    let newCovidDeathsByMonth =[]
    for (let cases of propertiesList[1]){
            if (cases.year == year){
                newCovidDeathsByMonth = cases['New Deaths']
            }
        }

    // Get the sum of the new coivd cases that year
    const sumCovidDeaths = newCovidDeathsByMonth.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
    // Send sum of covid cases and eaths to be graphed as a pie chart
    buildCharts3(sumCovidCases,sumCovidDeaths)

    // Add Covid deaths total to panel 4
    panel4.append("p")
        .text(`${sumCovidDeaths.toLocaleString()}`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1)
        .style("font-family", "Arial")
        .style("font-size", "25px")
        .style("font-weight", "bold")
        .style("color", "red");

    // Get the gdp data by year
    let gdpDataList = []
    Object.entries(propertiesList[2]).forEach(([key, value]) => {
        gdpDataList.push(value)})
    let gdpAndYearList = []
    Object.entries(gdpDataList).forEach(([key, value]) => {
        gdpAndYearList.push(value)})
    for (let i=0; i<gdpAndYearList.length; i++){
        if (gdpAndYearList[i].year==year){
            // Add GDP to panel 5
            panel5.append("p")
                .text(`$${(gdpAndYearList[i].GDP/1000000000).toLocaleString(undefined,{ maximumFractionDigits: 1 })}`)
                .style('opacity', 0)
                .transition()
                .duration(500)
                .style('opacity', 1)
                .style("font-family", "Arial")
                .style("font-size", "25px")
                .style("font-weight", "bold")
                .style("color", "green");
        }
    }
    
    // Add population density to panel 6
    panel6.append("p")
                .text(`${propertiesList[5]}`)
                .style('opacity', 0)
                .transition()
                .duration(500)
                .style('opacity', 1)
                .style("font-family", "Arial")
                .style("font-size", "25px")
                .style("font-weight", "bold")
                .style("color", "purple");
    
    // Send gdp data for graphing
    buildCharts4(gdpAndYearList)
    
    });


        
}
  
// function for building chart 1
function buildCharts(data){
    let yValues = data
    let trace = {
        x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        y: yValues,
        mode: 'line',
        // text: otuLabels,
        marker: {
        //   size: data,
          color: 'black',
        }
      }

    let chartData = [trace]

    let layout = {
        title: 'Unemployment Rates During the Year',
        xaxis: {
          title: 'Months'
        },
        yaxis: {
          title: 'Percentage'
        },
        transition:{
          duration: 500,
          easing:'linear'
        }
      };
    Plotly.react('chart1', chartData, layout);
}

// Function for building chart 2
function buildCharts2(data){
    let yValues = data
    let trace = {
        x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        y: yValues,
        type: 'bar',
        marker: {
          color: 'blue',
        }
      }

    let chartData = [trace]

    let layout = {
        title: 'New Covid Cases During the Year',
        xaxis: {
          title: 'Months'
        },
        yaxis: {
          title: 'Case Numbers'
        },
        transition:{
          duration: 500,
          easing:'linear'
        }
      };
    Plotly.react('chart2', chartData, layout);
}

// function for building chart 3
function buildCharts3(cases,deaths){
    let recoveries = cases - deaths
    const trace = {
        values: [recoveries, deaths],
        labels: ['Recoveries', 'Deaths'],
        type: 'pie',
        marker: {
            colors: ['blue', 'red']
        }
    };

    let chartData = [trace]

    let layout = {
        title: 'Covid Recovery to Death Ratio',
        transition:{
          duration: 500,
          easing:'linear'
        }
      };
    Plotly.react('chart3', chartData, layout);
}

// function for building chart 4
function buildCharts4(data){
    let xValues = [data[0].year,data[1].year,data[2].year,data[3].year,data[4].year]
    let yValues = [data[0].GDP,data[1].GDP,data[2].GDP,data[3].GDP,data[4].GDP]
    let trace = {
        x: xValues,
        y: yValues,
        type: 'bar',
        marker: {
          color: 'green',
        }
      }

    let chartData = [trace]

    let layout = {
        title: 'State GDP from 2018 to 2022',
        xaxis: {
          title: 'Years'
        },
        yaxis: {
          title: 'US Dollars'
        },
        transition:{
          duration: 500,
          easing:'linear'
        }
      };
    Plotly.react('chart4', chartData, layout);
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

// Initialize the starting information
init()

// Create the map
d3.json(stateUrl).then(data =>{
    d3.json(countyUrl).then(countiesData=> {
        
        // Load the county geojson data
        geojson2 = L.geoJson(countiesData, {
            style: styleCounties,
            onEachFeature: onEachFeatureCounty
        }).addTo(map);
        
        // Load the state geojson data
        geojson = L.geoJson(data, {
            style: styleStates,
            onEachFeature: onEachFeatureState
        }).addTo(map);
        
        // Create a basic info block for names
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.updateState();
            return this._div;
        };
        
        // Method that we will use to update the info block based on state
        info.updateState = function (props) {
            this._div.innerHTML = '<h4>US Map</h4>' +  (props ?
                '<b>' + props.name + '</b><br />'
                : 'Hover over a state');
            };
            
        // Method that we will use to update the info block based on country
        info.updateCounty = function (name) {
            this._div.innerHTML = '<h4>US Map</h4>' +  (name ?
                '<b>' + name + '</b><br />'
                : 'Hover over a county');
            };
        
        // Adds the info block to the map
        info.addTo(map);
        
        // Ratio buttons for the states and counties layers
        const overlayMaps = {
            States: geojson,
            Counties: geojson2,
        };
        
        // Create a layer control that contains our states and counties layers.
        let layerControl = L.control.layers(overlayMaps, null,{
            collapsed: false,
        });
        layerControl.addTo(map);
        
        // Create a legend for the covid cases intensty
        var legend = L.control({position: 'bottomright'});
        
        // Add the legend info
        legend.onAdd = function (map) {
            
            var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 200, 300, 400, 500, 750, 1000, 1500, 2000],
            actualGrades = [0, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000],
            labels = [];
            
            // Create a title for the legend
            div.innerHTML +='Covid Cases<br>in Thousands<br>'

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                '<i style="background:' + getColorStates(actualGrades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
            
            return div;
        };
        
        // Add the legend to the map
        legend.addTo(map);
        
        // Styling for the top ID number block
        let idPanel = d3.select('.card')
        idPanel.transition().duration(500)
    })

})

