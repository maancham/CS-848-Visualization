// Function to update the visualization based on the selected category
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

      var visualization = document.getElementById("visualization");
      visualization.innerHTML = "";

      top10Universities.forEach(function (university) {
        var universityElement = document.createElement("div");
        universityElement.classList.add("university");
        universityElement.innerHTML = `
            <div class="university-name">${university.school} - Ranking: ${
          university[category + "_ranking"]
        }</div>
            <div class="category-info">Count: ${
              university[category + "_count"]
            } - Faculty: ${university[category + "_faculty"]}</div>
        `;
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
