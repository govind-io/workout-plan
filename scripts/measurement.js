// Determine BMI category and background color based on BMI value
function getBMICategoryAndStyle(bmi) {
  let category = "";
  let style = "";

  if (bmi < 18.5) {
    category = "Underweight";
    style = "background-color: lightblue; color: black;";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = "Normal weight";
    style = "background-color: lightgreen; color: black;";
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = "Overweight";
    style = "background-color: orange; color: white;";
  } else {
    category = "Obese";
    style = "background-color: red; color: white;";
  }

  return { category, style };
}

// Get body fat category and style
function getBodyFatCategoryAndStyle(bodyFat) {
  let category = "";
  let style = "";

  if (bodyFat < 21) {
    category = "Underfat";
    style = "background-color: lightblue; color: black;";
  } else if (bodyFat >= 21 && bodyFat <= 33) {
    category = "Healthy";
    style = "background-color: lightgreen; color: black;";
  } else if (bodyFat > 33 && bodyFat <= 39) {
    category = "Overweight";
    style = "background-color: orange; color: white;";
  } else {
    category = "Obese";
    style = "background-color: red; color: white;";
  }

  return { category, style };
}

const showFormBtn = document.getElementById("show-form-btn");
const measurementForm = document.getElementById("measurement-form");
const measurementInputForm = document.getElementById("measurement-input-form");
const measurementBody = document.getElementById("measurement-body");
let measurements = JSON.parse(localStorage.getItem("measurements")) || [];
let isEditing = false;

// Chart.js chart instances
const weightChart = createLineChart("weightChart", "Weight (kg)");
const chestChart = createLineChart("chestChart", "Chest (cm)");
const waistChart = createLineChart("waistChart", "Waist (cm)");
const hipsChart = createLineChart("hipsChart", "Hips (cm)");
const armChart = createLineChart("armChart", "Arms Average (cm)");
const thighChart = createLineChart("thighChart", "Thighs Average (cm)");
const calfChart = createLineChart("calfChart", "Calves Average (cm)");
const bmiChart = createLineChart("bmiChart", "BMI");
const bodyFatChart = createLineChart("bodyFatChart", "Body Fat (%)");

// Load measurements from localStorage when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadMeasurements();
  updateAllCharts();
});

// Show form when "Add Measurements" button is clicked
showFormBtn.addEventListener("click", () => {
  measurementForm.style.display =
    measurementForm.style.display === "none" ||
    measurementForm.style.display === ""
      ? "block"
      : "none";
});

// Add Measurement
measurementInputForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const waist = parseFloat(document.getElementById("waist").value);
  const neck = parseFloat(document.getElementById("neck").value);
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  const bmi = calculateBMI(weight, height); // Calculate BMI
  const bodyFat = calculateBodyFatPercentageSI(waist, neck, height); // Calculate body fat percentage using SI formula

  const measurement = {
    id: generateUniqueId(),
    date: new Date().getTime(),
    weight: weight,
    height: height,
    chest: parseFloat(document.getElementById("chest").value),
    waist: waist,
    hips: parseFloat(document.getElementById("hips").value),
    neck: neck,
    leftArm: parseFloat(document.getElementById("leftArm").value),
    rightArm: parseFloat(document.getElementById("rightArm").value),
    leftThigh: parseFloat(document.getElementById("leftThigh").value),
    rightThigh: parseFloat(document.getElementById("rightThigh").value),
    leftCalf: parseFloat(document.getElementById("leftCalf").value),
    rightCalf: parseFloat(document.getElementById("rightCalf").value),
    bodyFat: bodyFat,
    bmi: bmi,
  };

  saveMeasurement(measurement);
  addMeasurementToTable(measurement);
  resetForm();
  updateAllCharts(); // Ensure charts are updated after adding new measurements
});

// Save Measurement to localStorage
function saveMeasurement(measurement) {
  measurements.push(measurement);
  localStorage.setItem("measurements", JSON.stringify(measurements));
}

// Load measurements from localStorage
function loadMeasurements() {
  measurementBody.innerHTML = "";
  measurements.forEach((measurement) => addMeasurementToTable(measurement));
}

// Add measurement to the table with BMI and Body Fat Percentage
function addMeasurementToTable(measurement) {
  const row = document.createElement("tr");
  row.dataset.id = measurement.id; // Store unique ID in row

  // Get body fat category and style
  const { category: bodyFatCategory, style: bodyFatStyle } =
    getBodyFatCategoryAndStyle(measurement.bodyFat);

  // Get BMI category and style
  const { category: bmiCategory, style: bmiStyle } = getBMICategoryAndStyle(
    measurement.bmi
  );

  row.innerHTML = `
        <td>${formatDate(new Date(measurement.date))}</td>
        <td>${measurement.weight}</td>
        <td>${measurement.height}</td>
        <td>${measurement.chest}</td>
        <td>${measurement.waist}</td>
        <td>${measurement.hips}</td>
        <td>${measurement.neck}</td>
        <td>${measurement.leftArm}</td>
        <td>${measurement.rightArm}</td>
        <td>${measurement.leftThigh}</td>
        <td>${measurement.rightThigh}</td>
        <td>${measurement.leftCalf}</td>
        <td>${measurement.rightCalf}</td>
        <td style="${bodyFatStyle}">${
    measurement.bodyFat
  }% (${bodyFatCategory})</td> 
         <td style="${bmiStyle}">${measurement.bmi.toFixed(
    2
  )} (${bmiCategory})</td> 
        <td>
            <button class="btn delete-btn" onclick="deleteMeasurement('${
              measurement.id
            }')">Delete</button>
        </td>
    `;
  measurementBody.appendChild(row);
}

// Delete measurement by unique ID
function deleteMeasurement(id) {
  // Remove from localStorage
  measurements = measurements.filter((measurement) => measurement.id !== id);
  localStorage.setItem("measurements", JSON.stringify(measurements));

  // Remove from table
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) row.remove();

  updateAllCharts(); // Update charts after deleting a measurement
}

// Reset form
function resetForm() {
  measurementInputForm.reset();
  isEditing = false;
  measurementForm.style.display = "none";
}

// Create Chart.js line charts
function createLineChart(canvasId, label) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: label,
          data: [],
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
          tension: 0.1,
        },
      ],
      tension: 0.1,
      spanGaps: true,
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Update all charts with the current measurements
function updateAllCharts() {
  updateChart(weightChart, "weight");
  updateChart(chestChart, "chest");
  updateChart(waistChart, "waist");
  updateChart(hipsChart, "hips");
  updateChart(armChart, ["leftArm", "rightArm"], "Arms Average");
  updateChart(thighChart, ["leftThigh", "rightThigh"], "Thighs Average");
  updateChart(calfChart, ["leftCalf", "rightCalf"], "Calves Average");
  updateChart(bodyFatChart, "bodyFat");
  updateChart(bmiChart, "bmi");
}

// Update specific chart based on measurement data
function updateChart(chart, measurementField) {
  chart.data.labels = measurements.map(
    (measurement) => new Date(measurement.date)
  );

  // Update the dataset
  if (Array.isArray(measurementField)) {
    chart.data.datasets[0].data = measurements.map((measurement) => {
      const total = measurementField.reduce(
        (sum, field) => sum + parseFloat(measurement[field]),
        0
      );
      return total / measurementField.length; // Average for bilateral measurements
    });
  } else {
    chart.data.datasets[0].data = measurements.map((measurement) =>
      parseFloat(measurement[measurementField])
    );
  }

  chart.update(); // Ensure chart is updated after data changes
}
