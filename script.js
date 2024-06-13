// Store our API endpoint as queryUrl.
let apiKey = 'e6a29efb-49fe-42d1-922a-2298ab577236'
let queryUrl =
  `https://publicapi.ohgo.com/api/v1/construction?region=central-ohio&api-key=${apiKey}`;

// Build the metadata panel
function buildMetadata(sample) {
    d3.json(queryUrl).then((data) => {
    
    //   // get the metadata field
    //   const metaDataField = data.metadata
  
    //   // Filter the metadata for the object with the desired sample number
    //   let desiredSample = metaDataField.filter(object => object.id == sample)
      
      // Use d3 to select the panel with id of `#sample-metadata`
      let panel = d3.select('#sample-metadata')
  
      // Use `.html("") to clear any existing metadata
      panel.html("")
  
      // Inside a loop, you will need to use d3 to append new
      // tags for each key-value in the filtered metadata.
    //   desiredSample.forEach(item => {
    //     Object.entries(item).forEach(([key, value]) => {
    //         panel.append("p")
    //             .text(`${key.toUpperCase()}: ${value}`)
    //             .style('opacity', 0)
    //             .transition()
    //             .duration(500)
    //             .style('opacity', 1);
    //     });
    //   });
    });
  }
  
  // function to build both charts
  function buildCharts(sample) {
    d3.json(queryUrl).then((data) => {
      let newData = data.results

  

      // Build a Bar Chart
      // Don't forget to slice and reverse the input data appropriately
      let trace2 = {
        x: [1,2,3,4],
        y: [2,4,8,16],
        type: 'bar',
        orientation: "h",
        text: 'something',
        marker: {
          color: 'red'
        }
      }
  
      // Perpare bar data for plotting
      let barData = [trace2]
  
      // Perpare layout for plotting
      let layout2 = {
        title: 'Something',
        xaxis: {
          title: 'Numbers'
        }
      }
  
      // Render the Bar Chart
      Plotly.newPlot('bar1', barData, layout2)

      let trace3 = {
        x: [1,2,3,4],
        y: [2,4,8,16],
        type: 'bar',
        orientation: "h",
        text: 'something',
        marker: {
          color: 'blue'
        }
      }
      // Perpare bar data for plotting
      let barData2 = [trace3]
  
      // Perpare layout for plotting
      let layout3 = {
        title: 'Something',
        xaxis: {
          title: 'Numbers'
        }
      }
  
      // Render the Bar Chart
      Plotly.newPlot('bar2', barData2, layout3)

      // Create the base layers.
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street
  };

  // Create the marker layer.
  let markerArray = newData.map((data) => {
    let lat = data.latitude;
    let lon = data.longitude;
    let place = L.circle([lat, lon], {
      color: 'red',
      fillColor: 'red',
      stroke: false,
      fillOpacity: 0.5,
      radius: 500,
    });

    return place;
  });

  // Create a layer group 
  const markerLayer = L.layerGroup(markerArray);

  // Create map overlay
  const overlayMaps = {
    Construction: markerLayer,
    
  };

  // Create a new map.
  let myMap = L.map("map", {
    center: [39.822612, -82.956138],
    zoom: 9,
    layers: [street, markerLayer],
  });

  // Create a layer control that contains our baseMaps.
  let layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
  });
  layerControl.addTo(myMap);
    });
  }
  
  // Function to run on page load
  function init() {
    d3.json(queryUrl).then((data) => {
        console.log(data.results)
      // Get the names field
      const namesField = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
        "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
        "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
        "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
        "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ]
  
      // Use d3 to select the dropdown with id of `#selDataset`
      let dropdownMenu = d3.select("#selDataset")
  
      // Use the list of sample names to populate the select options
      dropdownMenu.selectAll("option")
          .data(namesField)
          .enter()
          .append("option")
          .text(d => d)
          .attr("value", d => d);
  
      // Get the first sample from the list
      const firstName = namesField[0]

      buildMetadata(firstName)
      buildCharts(firstName)
    });
  }

  
  // Function for event listener
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  // Initialize the dashboard
  init();
  