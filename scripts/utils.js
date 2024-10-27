// Calculate Body Fat Percentage using Metric Units (SI)
function calculateBodyFatPercentageSI(waist, neck, height) {
  // Formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
  const logWaistNeck = Math.log10(waist - neck);
  const logHeight = Math.log10(height);
  const bodyFatPercentage =
    495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;

  return bodyFatPercentage.toFixed(2); // Return with two decimal places
}

function formatDate(date) {
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  let year = date.getFullYear();

  let hours = date.getHours();
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");

  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  hours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

// Generate a unique ID for each measurement
function generateUniqueId() {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

// calculate BMI
function calculateBMI(weight, height) {
  return (weight / (height * height)) * 10000; // height in cm, weight in kg
}
