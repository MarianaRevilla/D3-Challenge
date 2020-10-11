// 1. Define SVG dimensions and set on webpage:
var svgWidth = 960;
var svgHeight = 620;
var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// 2. Append classed chart to the scatter element: 
var chart = d3.select("#scatter").append("div").classed("chart", true);

// 3. Append SVG element to the chart: 
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// 4. Append an SVG group: 
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 5. Retrieve the CSV data: 
d3.csv("data.csv").then(function(censusData) {
  // Parse it:
  censusData.forEach(function(data) {
      data.smokes = +data.smokes;
      data.poverty = +data.poverty;
  });

// 6. Create linear scales for the axes: 
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(censusData, d => d.poverty) * 0.8,
      d3.max(censusData, d => d.poverty) * 1.2])
  .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(censusData, d => d.smokes) * 0.8,
      d3.max(censusData, d => d.smokes) * 1.2])
  .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// 7. Append x axis: 
  var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

// 8. Append y axis: 
  var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

// 9. Append the circles for the graph: 
  let circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", 12)
      .attr("opacity", ".5");

    // Create tooltips: 
      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([10, -10])
      .html(function(d) {
        return (`<strong>${(d.state)}<hr> Poverty ${(d.poverty)}% <hr> Smokes ${d.smokes}%`);
      });

    // Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip:
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    // Create "mouseout" event listener to hide tooltip:
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });

// 10. Append State abbreviation to the circles: 
  chartGroup.selectAll(".stateText")
  .data(censusData)
  .enter()
  .append("text")
  .classed("stateText", true)
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.smokes))
  .attr("dy", 3)
  .attr("font-size", "10px")
  .text(function(d){return d.abbr});

// 11. Label the axes: 
  chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height/2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes (%)");

    }).catch(function(error) {
      console.log(error);  
    });

   






