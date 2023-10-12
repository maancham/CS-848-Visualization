function createBubbleChart(data, category) {
  var width = 800;
  var height = 400;

  // Clear the previous SVG
  d3.select("#bubble-chart").selectAll("svg").remove();

  var svg = d3.select("#bubble-chart").append("svg")
      .attr("width", width)
      .attr("height", height);

  var radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(data, function(d) { return +d[category + "_ranking"]; })])
      .range([10, 40]);

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  var bubbles = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d, i) { return (i % 5) * 150 + 100; }) // Adjust spacing and rows
      .attr("cy", function(d, i) { return Math.floor(i / 5) * 100 + 100; }) // Adjust spacing and columns
      .attr("r", function(d) { return radiusScale(+d[category + "_ranking"]); })
      .attr("fill", function(d) { return colorScale(d.school); })
      .attr("class", "bubble")
      .on("mouseover", function(event, d) {
        var tooltipText = `School: ${d.school}\nRanking: ${d[category + "_ranking"]}\nCount: ${d[category + "_count"]}\nFaculty: ${d[category + "_faculty"]}`;
  
        d3.select("#tooltip")
            .text(tooltipText)
            .style("display", "block")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function() {
        d3.select("#tooltip").style("display", "none");
      });

  var labels = svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", function(d, i) { return (i % 5) * 150 + 100; }) // Adjust spacing and rows
      .attr("y", function(d, i) { return Math.floor(i / 5) * 100 + 100; }) // Adjust spacing and columns
      .text(function(d) { return d.school; })
      .attr("class", "label");
}


function updateVisualization(category) {
  d3.csv("top_canada.csv")
    .then(function (data) {
      var filteredData = data.filter(function (d) {
        return (
          d[category + "_ranking"] !== "" &&
          d[category + "_ranking"] !== undefined
        );
      });

      filteredData.sort(function (a, b) {
        return +a[category + "_ranking"] - +b[category + "_ranking"];
      });

      var top10Universities = filteredData.slice(0, 10);

      createBubbleChart(top10Universities, category);

    })
    .catch(function (error) {
      console.error("Error loading the dataset:", error);
    });
}

document
  .getElementById("category-select")
  .addEventListener("change", function () {
    updateVisualization(this.value);
  });

updateVisualization("all");
