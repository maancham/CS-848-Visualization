// Function to update the visualization based on the selected category
function updateVisualization(category) {
  d3.csv("top_canada.csv")
    .then(function (data) {
      data.sort(function (a, b) {
        return +a[category + "_ranking"] - +b[category + "_ranking"];
      });

      var top10Universities = data.slice(0, 10);
      var visualization = document.getElementById("visualization");
      visualization.innerHTML = "";

      top10Universities.forEach(function (university) {
        var universityElement = document.createElement("div");
        universityElement.textContent =
          university.school +
          " - Ranking: " +
          university[category + "_ranking"];
        visualization.appendChild(universityElement);
      });
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
