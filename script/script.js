// Grab our api links for the data
stateUrl = "http://127.0.0.1:5000/api/v1.0/states";
countyUrl = "http://127.0.0.1:5000/api/v1.0/counties";

// Creating some initial variables
var map = L.map("map").setView([37.8, -96], 4);
var geojson;
var geojson2;
var textColor = "black";
var cardColor = "rgb(235, 235, 235)";
var info = L.control();
var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Changes the map coloring for states based on covid cases
function getColorStates(d) {
  return d > 2000000
    ? "#800026"
    : d > 1500000
    ? "#BD0026"
    : d > 1000000
    ? "#E31A1C"
    : d > 750000
    ? "#FC4E2A"
    : d > 500000
    ? "#FD8D3C"
    : d > 400000
    ? "#FEB24C"
    : d > 300000
    ? "#FED976"
    : d > 200000
    ? "#FFEDA0"
    : "#FFFFCC";
}

// Changes the map coloring for counties based on covid cases
function getColorCounty(d) {
  return d > 200000
    ? "#800026"
    : d > 150000
    ? "#BD0026"
    : d > 75000
    ? "#E31A1C"
    : d > 50000
    ? "#FC4E2A"
    : d > 25000
    ? "#FD8D3C"
    : d > 12500
    ? "#FEB24C"
    : d > 6000
    ? "#FED976"
    : d > 3000
    ? "#FFEDA0"
    : d > 1500
    ? "#FFFFCC"
    : d > 750
    ? "#E0F3F8"
    : d > 300
    ? "#BAE4BC"
    : d > 100
    ? "#7BCCC4"
    : "#43A2CA";
}

// Styles the states
function styleStates(feature) {
  let cases2020 = feature.properties["Covid Confirmed"][0]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue, 0);
  let cases2021 = feature.properties["Covid Confirmed"][1]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue, 0);
  let cases2022 = feature.properties["Covid Confirmed"][2]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue, 0);
  let cases2023 = feature.properties["Covid Confirmed"][3]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue, 0);

  let totalCaseCount = cases2020 + cases2021 + cases2022 + cases2023;
  return {
    fillColor: getColorStates(totalCaseCount),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

// Styles the counties
function styleCounties(feature) {
  let cases2020 = feature.properties["Covid Confirmed"][0]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2021 = feature.properties["Covid Confirmed"][1]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2022 = feature.properties["Covid Confirmed"][2]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2023 = feature.properties["Covid Confirmed"][3]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);

  let totalCaseCount = cases2020 + cases2021 + cases2022 + cases2023;
  return {
    fillColor: getColorCounty(totalCaseCount),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

// Highlights the states
function highlightFeatureState(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  layer.bringToFront();
  info.updateState(layer.feature.properties);
}

// Highlights the counties
function highlightFeatureCounty(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  layer.bringToFront();
  info.updateCounty(layer.feature.properties.NAME);
}

// resets the highlighting on each state
function resetHighlightState(e) {
  geojson.resetStyle(e.target);
  info.updateState();
}

// resets the highlighting on each county
function resetHighlightCounty(e) {
  geojson2.resetStyle(e.target);
  info.updateCounty();
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
    click: zoomToFeature,
  });

  // Grab covid cases for each year
  let cases2020 = feature.properties["Covid Confirmed"][0]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2021 = feature.properties["Covid Confirmed"][1]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2022 = feature.properties["Covid Confirmed"][2]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2023 = feature.properties["Covid Confirmed"][3]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);

  // Total the cases up
  let totalCaseCount = cases2020 + cases2021 + cases2022 + cases2023;

  // Create popup for each state
  layer.bindPopup(
    "<h4>" + feature.properties.name + "</h4>" + "<p>Popultion Density: " +
      feature.properties.density + " people/mi<sup>2</sup></p>" +
      "<p>Total Covid Cases From January 2020 to Febuary 2023: " +
      totalCaseCount.toLocaleString() + " people </p>");
}

// Applies the functions to the counties layer
function onEachFeatureCounty(feature, layer) {
  layer.on({
    mouseover: highlightFeatureCounty,
    mouseout: resetHighlightCounty,
    click: zoomToFeature,
  });

  // Grab covid cases for each year
  let cases2020 = feature.properties["Covid Confirmed"][0]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2021 = feature.properties["Covid Confirmed"][1]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2022 = feature.properties["Covid Confirmed"][2]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);
  let cases2023 = feature.properties["Covid Confirmed"][3]["New Cases"].reduce(
    (accumulator, currentValue) => accumulator + currentValue,0);

  // Total the cases up
  let totalCaseCount = cases2020 + cases2021 + cases2022 + cases2023;

  // Create popup for each county
  layer.bindPopup(
    "<h4>" +
      feature.properties.NAME + "</h4>" + "<p>Census Area: " +
      feature.properties.CENSUSAREA + " mi<sup>2</sup></p>" +
      "<p>Total Covid Cases From January 2020 to Febuary 2023: " +
      totalCaseCount.toLocaleString() + " people </p>"
  );
}

// Builds the state specific elements
function buildStatedata(state, year) {
  d3.json(stateUrl).then((data) => {
    // get the metadata field
    const metaDataField = data.features;

    // Filter the metadata for the object with the desired state
    let desiredState = metaDataField.filter(
      (object) => object.properties.name == state
    );

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata1");
    let panel2 = d3.select("#sample-metadata2");
    let panel3 = d3.select("#sample-metadata3");
    let panel4 = d3.select("#sample-metadata4");
    let panel5 = d3.select("#sample-metadata5");
    let panel6 = d3.select("#sample-metadata6");

    // Use `.html("") to clear any existing metadata
    panel.html("");
    panel2.html("");
    panel3.html("");
    panel4.html("");
    panel5.html("");
    panel6.html("");

    // Get properties from the selected state
    let propertiesList = [];
    Object.entries(desiredState[0].properties).forEach(([key, value]) => {
      propertiesList.push(value);
    });
  
    // Get the population data by year
    let populationDataList = [];
    Object.entries(propertiesList[4]).forEach(([key, value]) => {
      populationDataList.push(value);
    });
    let popAndYearList = [];
    Object.entries(populationDataList).forEach(([key, value]) => {
      popAndYearList.push(value);
    });
    for (let i = 0; i < popAndYearList.length; i++) {
      if (popAndYearList[i].year == year) {
        // Add population to panel 1
        panel
          .append("p")
          .text(`${popAndYearList[i].Population.toLocaleString()}`)
          .style("opacity", 0)
          .transition()
          .duration(500)
          .style("opacity", 1)
          .style("font-family", "Arial")
          .style("font-size", "25px")
          .style("font-weight", "bold")
          .style("color", "purple");
      }
    }

    // Get umemployment data by year
    let unemploymentRatesByMonth = [];
    for (let month of propertiesList[5]) {
      if (month.year == year) {
        unemploymentRatesByMonth.push(month.value);
      }
    }
    unemploymentRatesByMonth.reverse();
    // Get the sum of the unemployment rates
    const sumUnemployment = unemploymentRatesByMonth.reduce(
      (accumulator, currentValue) => accumulator + currentValue,0);
    // Calculate the unemployment average
    const averageUnemployment = sumUnemployment / unemploymentRatesByMonth.length;
    // Add unemployment average to panel 2
    panel2
      .append("p")
      .text(`${averageUnemployment.toFixed(1)}%`)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1)
      .style("font-family", "Arial")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .style("color", "black");

    // New Covid Cases data by year
    let newCovidCaseByMonth = [];
    for (let cases of propertiesList[1]) {
      if (cases.year == year) {
        newCovidCaseByMonth = cases["New Cases"];
      }
    }

    // Get the sum of the new coivd cases that year
    const sumCovidCases = newCovidCaseByMonth.reduce(
      (accumulator, currentValue) => accumulator + currentValue,0);

    // Add Covid Cases total to panel 3
    panel3
      .append("p")
      .text(`${sumCovidCases.toLocaleString()}`)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1)
      .style("font-family", "Arial")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .style("color", "blue");

    // New Covid Cases data by year
    let newCovidDeathsByMonth = [];
    for (let cases of propertiesList[2]) {
      if (cases.year == year) {
        newCovidDeathsByMonth = cases["New Deaths"];
      }
    }

    // Get the sum of the new coivd cases that year
    const sumCovidDeaths = newCovidDeathsByMonth.reduce(
      (accumulator, currentValue) => accumulator + currentValue,0);

    // Add Covid deaths total to panel 4
    panel4
      .append("p")
      .text(`${sumCovidDeaths.toLocaleString()}`)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1)
      .style("font-family", "Arial")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .style("color", "red");
    
    // Get cpi data for the selected year
    let cpiThisYear = [];
    for (let month of propertiesList[0]) {
        if (month.year == year) {
            cpiThisYear.push(month.value);
        }
    }
    // Get cpi data for the selected year's previous year
    let cpiLastYear = [];
    for (let month of propertiesList[0]) {
        if (month.year == year - 1) {
            cpiLastYear.push(month.value);
        }
    }
    // Calculate the inflation rate for each month of the selected year
    let inflationByMonth = [];
    for (let i = 0; i < 12; i++) {
      let inflationRate =
        ((cpiThisYear[i] - cpiLastYear[i]) / cpiLastYear[i]) * 100;
      inflationByMonth.push(inflationRate);
    }
    inflationByMonth.reverse();
    // Get the sum of the inflation rates
    const sumInflation = inflationByMonth.reduce(
      (accumulator, currentValue) => accumulator + currentValue,0);
    // Calculate the inflation average
    const averageInflation = sumInflation / inflationByMonth.length;
    // Add inflation average to panel 5
    panel5
        .append("p")
        // .text(`$${(gdpAndYearList[i].GDP/1000000000).toLocaleString(undefined,{ maximumFractionDigits: 1 })}`)
        .text(`${averageInflation.toFixed(1)}%`)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("font-family", "Arial")
        .style("font-size", "25px")
        .style("font-weight", "bold")
        .style("color", "green");
      
    // Get the gdp data by year
    let gdpDataList = [];
    Object.entries(propertiesList[3]).forEach(([key, value]) => {
      gdpDataList.push(value);
    });
    let gdpAndYearList = [];
    Object.entries(gdpDataList).forEach(([key, value]) => {
      gdpAndYearList.push(value);
    });
    // Grab the gdp data for the state
    for (let i = 0; i < gdpAndYearList.length; i++) {
      if (gdpAndYearList[i].year == year) {
        // Add gdp per capita to panel 6
        panel6
          .append("p")
          .text(
            `$${(
              gdpAndYearList[i].GDP / popAndYearList[i - 2].Population
            ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
          )
          .style("opacity", 0)
          .transition()
          .duration(500)
          .style("opacity", 1)
          .style("font-family", "Arial")
          .style("font-size", "25px")
          .style("font-weight", "bold")
          .style("color", "purple");
      } 
    }

    // Send sum of covid cases and eaths to be graphed as a pie chart
    buildChart1(sumCovidCases, sumCovidDeaths, state);
    // Send data to graph stacked area chart
    buildChart2(unemploymentRatesByMonth, newCovidCaseByMonth, inflationByMonth);
    // Send gdp data for graphing
    buildCharts3(gdpAndYearList, state);
    // Build our top 10 bar chart
    if (year==2023){
      
    } else{
      buildCharts4(year);
    }
  });
}

// function for building chart 1
function buildChart1(cases, deaths, state) {
  // Calculate recoveries
  let recoveries = cases - deaths;

  // Attach the chart to chart 1
  var chartDom = document.getElementById("chart1");
  var myChart = echarts.init(chartDom);
  var option;

  // Options for the pie chart
  option = {
    title: {
      text: `${state}`,
      subtext: "Covid Recoveries to Deaths",
      left: "left",
      textStyle: {
        color: textColor, // Set text to common text color
      },
      subtextStyle: {
        color: textColor, // Set text to common text color
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      left: "center",
      top: "bottom",
      data: ["rose1", "rose2"],
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "Covid Case",
        type: "pie",
        radius: [20, 140],
        center: ["50%", "50%"],
        roseType: "radius",
        label: {
          color: textColor, // Set text to common text color
        },
        labelLine: {
          smooth: 0.2,
          length: 10,
          length2: 20,
        },
        itemStyle: {
          borderRadius: 10,
          color: "#c23531",
          shadowBlur: 50,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        data: [
          {
            value: recoveries,
            name: "Recoveries",
            // Color the pie chart recoveries
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "blue",
                },
                {
                  offset: 1,
                  color: "black",
                },
              ]),
            },
          },
          { value: deaths, name: "Deaths", itemStyle: { color: "red" } },
        ],
      },
    ],
  };


  // Add options to the chart
  option && myChart.setOption(option);
}

// Function to create the stacked area graph
function buildChart2(unemploy, covid, inflation) {
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    // Attach the chart to chart 2
    var chartDom = document.getElementById("chart2");
    var myChart = echarts.init(chartDom);
    var option;

    // Options for the stacked area chart
    option = {
        visualMap: [
        {
            show: false,
            type: "continuous",
            seriesIndex: 0,
            min: 0,
            max: 200,
        },
        {
            show: false,
            type: "continuous",
            seriesIndex: 1,
            dimension: 0,
            min: 0,
            max: months.length - 1,
        },
        {
            show: false,
            type: "continuous",
            seriesIndex: 2,
            dimension: 0,
            min: 0,
            max: months.length - 1,
        },
        ],
        title: [
        {
            top: "0%",
            left: "center",
            text: `Monthly Covid Cases`,
        },
        {
            top: "32%",
            left: "center",
            text: `Monthly Inflation Rates`,
        },
        {
            top: "68%",
            left: "center",
            text: `Monthly Unemployment Rates`,
        },
        ],
        tooltip: {
        trigger: "axis",
        },
        xAxis: [
        {
            data: months,
        },
        {
            data: months,
            gridIndex: 1,
        },
        {
            data: months,
            gridIndex: 2,
        },
        ],
        yAxis: [
        {},
        {
            gridIndex: 1,
        },
        {
            gridIndex: 2,
        },
        ],
        grid: [
        {
            top: "5%",
            height: "20%",
        },
        {
            top: "40%",
            height: "20%",
        },
        {
            top: "75%",
            height: "20%",
        },
        ],
        series: [
        {
            type: "line",
            showSymbol: false,
            data: covid,
            areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                offset: 0,
                color: "rgb(255, 158, 68)",
                },
                {
                offset: 1,
                color: "blue",
                },
            ]),
            },
        },
        {
            type: "line",
            showSymbol: false,
            data: inflation,
            xAxisIndex: 1,
            yAxisIndex: 1,
            areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                offset: 0,
                color: "rgb(255, 158, 68)",
                },
                {
                offset: 1,
                color: "green",
                },
            ]),
            },
        },
        {
            type: "line",
            showSymbol: false,
            data: unemploy,
            xAxisIndex: 2,
            yAxisIndex: 2,
            areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                offset: 0,
                color: "rgb(255, 158, 68)",
                },
                {
                offset: 1,
                color: "black",
                },
            ]),
            },
        },
        ],
    };

    // Add options to the chart
    option && myChart.setOption(option);
}
// function for building chart 3
function buildCharts3(data, state) {
  // Attach the chart to chart 3
  var chartDom = document.getElementById("chart3");
  var myChart = echarts.init(chartDom);
  var option;

  // Options for the area chart
  option = {
    title: {
      text: `${state} GDP Over the Years`,
      left: "center",
      top: 20,
      textStyle: {
        color: textColor, // Set text to common text color
      },
    },
    tooltip: {
      trigger: "item",
      // Formatter to customize the tooltip value for each marker
      formatter: function (value) {
        var adjustedValue = value.value / 1000000000;
        var formattedValue =
          "$" +
          adjustedValue.toLocaleString(undefined, { maximumFractionDigits: 0 });
        var string = `${value.seriesName} ${value.name} in billions was ${formattedValue}`;
        return string;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      // Supply the gdp data for the state
      data: [
        data[0].year,
        data[1].year,
        data[2].year,
        data[3].year,
        data[4].year,
      ],
      name: "Years",
      nameLocation: "middle",
      axisLine: {
        lineStyle: {
          color: textColor, // Set text to common text color
        },
      },
      axisTick: {
        lineStyle: {
          color: textColor, // Set text to common text color
        },
      },
      splitLine: {
        lineStyle: {
          color: textColor, // Set text to common text color
        },
      },
      nameTextStyle: {
        fontSize: 12,
        padding: 16,
        axisLabel: {
          textStyle: {
            color: textColor, // Set text to common text color
          },
        },
      },
    },
    yAxis: {
      type: "value",
      name: "US Dollars (in Billions)",
      nameLocation: "middle",
      axisLine: {
        lineStyle: {
          color: textColor, // Set text to common text color
        },
      },
      axisTick: {
        lineStyle: {
          color: textColor, // Set text to common text color
        },
      },
      splitLine: {
        lineStyle: {
          color: textColor, // Set text to common text color
        },
      },
      nameTextStyle: {
        fontSize: 12,
        padding: 28,
        color: textColor, // Set text to common text color
      },
      axisLabel: {
        // Rotate the labels if they are too long
        rotate: 30,
        // Formatter to customize the values for the y-axis
        formatter: function (value) {
          var adjustedValue = value / 1000000000;
          var formattedValue = "$" + adjustedValue.toLocaleString(); // Format with commas
          return formattedValue; 
        },
        textStyle: {
          color: textColor, // Set text to common text color
        },
      },
    },
    grid: {
      left: "3%", // Increase left margin to make space for y-axis labels
      right: "5%",
      bottom: "10%", // Increase bottom margin to make space for x-axis name
      containLabel: true,
    },
    series: [
      {
        name: "GDP for",
        data: [data[0].GDP, data[1].GDP, data[2].GDP, data[3].GDP, data[4].GDP],
        stack: "Total",
        // Color the area under the line
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "green",
            },
            {
              offset: 1,
              color: "black",
            },
          ]),
        },
        type: "line",
        areaStyle: {},
      },
    ],
  };

  // Add options to the chart
  option && myChart.setOption(option);
}

// Function for building chart 4
function buildCharts4(year) {
  d3.json(stateUrl).then((data) => {
    // Grab years for the data
    let GDPYearIndex = year - 2018;
    let popYearIndex = year - 2020;

    // Grab each state
    let states = data.features;

    // Create a list for the states
    let GDPPerCapList = [];

    // Loop through and get the gdp per capita for each state and there names
    for (let state of states) {
      try {
        let GPDPerCap =
          state.properties.GDP[GDPYearIndex].GDP /
          state.properties.Population[popYearIndex].Population;
        let stateName = state.properties.name;
        let dic = {
          Name: stateName,
          Value: GPDPerCap,
        };
        GDPPerCapList.push(dic);
      } catch (TypeError) {
        // console.error('An error occurred:', TypeError);
      }
    }
    // Sort the list by the value in each object
    GDPPerCapList.sort((a, b) => b.Value - a.Value);

    // Create list for the x and y values
    let xValues = [];
    let yValues = [];

    // Loop through the GDPPerCapList and grab the top ten states
    for (let i = 0; i < 10; i++) {
      yValues.push(GDPPerCapList[i].Name);
      xValues.push(GDPPerCapList[i].Value);
    }

    // Attach the chart to chart 4
    var chartDom = document.getElementById("chart4");
    var myChart = echarts.init(chartDom);
    var option;

    // Options for the bar chart
    option = {
      title: {
        text: "Top 10 GDP Per Capita",
        textStyle: {
          color: textColor, // Set text to common text color
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        // Formatter to customize the tooltip value for each marker
        formatter: function (params) {
          var value = params[0].value;
          var formattedValue = "$" + Math.round(value).toLocaleString();
          return params[0].axisValueLabel + ": " + formattedValue;
        },
      },
      legend: {
        textStyle: {
          color: textColor, // Set text to common text color
        },
      },
      grid: {
        left: "3%",
        right: "5%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        name: "GDP per Capita (Dollars)",
        nameLocation: "middle",
        axisLine: {
          lineStyle: {
            color: textColor, // Set text to common text color
          },
        },
        axisTick: {
          lineStyle: {
            color: textColor, // Set text to common text color
          },
        },
        splitLine: {
          lineStyle: {
            color: textColor, // Set text to common text color
          },
        },
        // Formatter to customize the values for the x-axis
        axisLabel: {
          formatter: function (value) {
            var adjustedValue = value;
            var formattedValue = "$" + adjustedValue.toLocaleString();
            return formattedValue;
          },
          textStyle: {
            color: textColor, // Set text to common text color
          },
        },
        nameTextStyle: {
          fontSize: 12,
          padding: 16,
        },
      },
      yAxis: {
        type: "category",
        data: yValues.reverse(),
        axisLine: {
          lineStyle: {
            color: textColor, // Set text to common text color
          },
        },
        axisTick: {
          lineStyle: {
            color: textColor, // Set text to common text color
          },
        },
        splitLine: {
          lineStyle: {
            color: textColor, // Set text to common text color
          },
        },
      },
      series: [
        {
          name: year,
          type: "bar",
          center: ["50%", "50%"],
          data: xValues.reverse(),
          // Coloring for the bars
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: "black",
              },
              {
                offset: 1,
                color: "purple",
              },
            ]),
          }
        },
      ],
    };

    // Add options to the chart
    option && myChart.setOption(option);
  });
}

// initilize the dropdown menus
function init() {
  d3.json(stateUrl).then((data) => {
    // Get the names field
    const namesField = [];
    for (state of data.features) {
      namesField.push(state.properties.name);
    }

    // List of the years in data
    const yearField = [2020, 2021, 2022, 2023];

    // Use d3 to select the dropdowns by id
    let dropdownMenu = d3.select("#selDataset");
    let dropdownMenu2 = d3.select("#selYear");

    // Use the list of state names to populate the select options
    dropdownMenu
      .selectAll("option")
      .data(namesField)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d) => d);

    // Use the list of the years to populate the select options
    dropdownMenu2
      .selectAll("option")
      .data(yearField)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d) => d);

    // Get the first item from each list
    const firstName = namesField[0];
    const firstYear = yearField[0];

    // Build state specific data
    buildStatedata(firstName, firstYear);
  });
}

// Function for event listener if state is changed
function optionChangedState(newState) {
  let year = document.getElementById("selYear").value;
  // Build state specific data
  buildStatedata(newState, year);
}

// Function for event listener if year is changed
function optionChangedYear(newYear) {
  let state = document.getElementById("selDataset").value;
  // Build state specific data
  buildStatedata(state, newYear);
}

// Initialize the starting information
init();

// Create the map
d3.json(stateUrl).then((data) => {
  d3.json(countyUrl).then((countiesData) => {
    // Load the county geojson data
    geojson2 = L.geoJson(countiesData, {
      style: styleCounties,
      onEachFeature: onEachFeatureCounty,
    });

    // Load the state geojson data
    geojson = L.geoJson(data, {
      style: styleStates,
      onEachFeature: onEachFeatureState,
    }).addTo(map);

    // Create a basic info block for names
    info.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      this.updateState();
      return this._div;
    };

    // Method that we will use to update the info block based on state
    info.updateState = function (props) {
      this._div.innerHTML =
        "<h4>US Map</h4>" +
        (props ? "<b>" + props.name + "</b><br />" : "Hover over a state");
    };

    // Method that we will use to update the info block based on country
    info.updateCounty = function (name) {
      this._div.innerHTML =
        "<h4>US Map</h4>" +
        (name ? "<b>" + name + "</b><br />" : "Hover over a county");
    };

    // Adds the info block to the map
    info.addTo(map);

    // Radio buttons for the states and counties layers
    const baseMaps = {
      States: geojson,
      Counties: geojson2,
    };

    // Create a layer control that contains our states and counties layers.
    let layerControl = L.control.layers(baseMaps, null, {
      collapsed: false,
    });
    layerControl.addTo(map);

    // Create a legend for the covid cases intensty
    var legend = L.control({ position: "bottomright" });

    // Add the legend info
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 200, 300, 400, 500, 750, 1000, 1500, 2000],
        actualGrades = [ 0, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000],
        labels = [];

      // Create a title for the legend
      div.innerHTML += "Covid Cases<br>in Thousands<br>";

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getColorStates(actualGrades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }

      return div;
    };

    // Add the legend to the map
    legend.addTo(map);

    // Styling for the top ID number block
    let idPanel = d3.select(".card");
    idPanel.transition().duration(500);
  });
});
