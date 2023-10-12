function createBubbleChart(data, category) {
  var width = 800;
  var height = 800;
  var centerX = width / 2;
  var centerY = height / 2;
  var backgroundCircleRadius = 250;

  // Clear the previous SVG
  d3.select("#bubble-chart").selectAll("svg").remove();

  var svg = d3.select("#bubble-chart").append("svg")
      .attr("width", width)
      .attr("height", height);

  var radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(data, function(d) { return +d[category + "_ranking"]; })])
      .range([10, 40]);

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  var circles = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d, i) {
        // Arrange circles on the perimeter of the background circle
        var angle = (i / data.length) * 2 * Math.PI;
        return centerX + backgroundCircleRadius * Math.cos(angle);
      })
      .attr("cy", function(d, i) {
        var angle = (i / data.length) * 2 * Math.PI;
        return centerY + backgroundCircleRadius * Math.sin(angle);
      })
      .attr("r", function(d) { return radiusScale(20 - 2*+d[category + "_ranking"]); })
      .attr("fill", function(d) { return colorScale(d.school); })
      .attr("class", "bubble")
      .on("mouseover", function(event, d) {

        circles.transition().style("opacity", 0.5);
        var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("display", "none");

        tooltip.html(
          `<strong>${d.school}</strong><br>Ranking: ${d[category + "_ranking"]}<br>Count: ${d[category + "_count"]}<br>Faculty: ${d[category + "_faculty"]}`)
          .style("display", "block")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function() {
        // Restore the circle size
        
        circles.transition().style("opacity", 1);

        d3.select(".tooltip").remove();
        d3.select(".tooltip")
          .style("display", "none");
      });


  var labels = svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", function(d, i) {
        var angle = (i / data.length) * 2 * Math.PI;
        return centerX + (backgroundCircleRadius + radiusScale(12 - 2*+d[category + "_ranking"])) * Math.cos(angle);
      })
      .attr("y", function(d, i) {
        var angle = (i / data.length) * 2 * Math.PI;
        return centerY + (backgroundCircleRadius + radiusScale(12 - 2*+d[category + "_ranking"])) * Math.sin(angle);
      })
      .text(function(d) {
        // Split the text into multiple lines
        var words = d.school.split(" ");
        return words.join("\n");
      })
      .attr("class", "label")
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .style("alignment-baseline", "middle")
      .style("pointer-events", "none");
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


// python -m http.server
