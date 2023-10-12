function createBubbleChart(data, category) {
  var screenWidth = window.innerWidth;

  var width = screenWidth * 0.7;
  var height = 200;
  var centerX = width / 5;

  d3.select("#bubble-chart").selectAll("svg").remove();

  var svg = d3.select("#bubble-chart").append("svg")
      .attr("width", width)
      .attr("height", height);

  var radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(data, function(d) { return +d[category + "_ranking"]; })])
      .range([10, 40]);

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  var infoBox = document.getElementById("info-box");
  var uniLogo = document.getElementById("uni-logo");
  var uniName = document.getElementById("uni-name");
  var uniLocation = document.getElementById("uni-location");
  var uniFounded= document.getElementById("uni-founded");
  var uniEnroll = document.getElementById("uni-enrollment");

  var circles = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d, i) {
        return centerX + i * 100; // Adjust the spacing between circles
      })
      .attr("cy", height / 2)
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
      })
      .on("click", function(d) {
        console.log(d.srcElement.__data__);
        console.log(category);
        uniLogo.src = d.srcElement.__data__.logo;
        uniName.textContent = d.srcElement.__data__.school;
        uniLocation.textContent = "Location: " + d.srcElement.__data__.location;
        uniFounded.textContent = "Founded: " + d.srcElement.__data__.founded;
        uniEnroll.textContent = "Head Count: " + d.srcElement.__data__.enrollment;
  
      });


  
  var labels = svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", function(d, i) {
        return centerX + i * 100; // Adjust the spacing between circles
      })
      .attr("y", height / 2)
      .text(function(d) {
        return d.school;
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
