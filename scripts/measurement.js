const showFormBtn = document.getElementById('show-form-btn');
const measurementForm = document.getElementById('measurement-form');
const measurementInputForm = document.getElementById('measurement-input-form');
const measurementBody = document.getElementById('measurement-body');
let isEditing = false;

// Load measurements from localStorage when page loads
document.addEventListener('DOMContentLoaded', loadMeasurements);

// Show form when "Add Measurements" button is clicked
showFormBtn.addEventListener('click', () => {
    measurementForm.style.display = measurementForm.style.display === 'none' || measurementForm.style.display === '' ? 'block' : 'none';
});

// Add Measurement
measurementInputForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const measurement = {
        date: new Date().toLocaleString(),
        weight: document.getElementById('weight').value,
        bodyFat: document.getElementById('bodyFat').value,
        chest: document.getElementById('chest').value,
        waist: document.getElementById('waist').value,
        hips: document.getElementById('hips').value,
        leftArm: document.getElementById('leftArm').value,
        rightArm: document.getElementById('rightArm').value,
        leftThigh: document.getElementById('leftThigh').value,
        rightThigh: document.getElementById('rightThigh').value,
        leftCalf: document.getElementById('leftCalf').value,
        rightCalf: document.getElementById('rightCalf').value
    };

    saveMeasurement(measurement);
    addMeasurementToTable(measurement);
    resetForm();
});

// Save Measurement to localStorage
function saveMeasurement(measurement) {
    let measurements = JSON.parse(localStorage.getItem('measurements')) || [];
    measurements.push(measurement);
    localStorage.setItem('measurements', JSON.stringify(measurements));
}

// Load measurements from localStorage
function loadMeasurements() {
    const measurements = JSON.parse(localStorage.getItem('measurements')) || [];
    measurementBody.innerHTML = '';
    measurements.forEach((measurement) => addMeasurementToTable(measurement));
}

// Add measurement to the table
function addMeasurementToTable(measurement) {
    const row = document.createElement('tr');
    row.innerHTML = `
                <td>${measurement.date}</td>
                <td>${measurement.weight}</td>
                <td>${measurement.bodyFat}</td>
                <td>${measurement.chest}</td>
                <td>${measurement.waist}</td>
                <td>${measurement.hips}</td>
                <td>${measurement.leftArm}</td>
                <td>${measurement.rightArm}</td>
                <td>${measurement.leftThigh}</td>
                <td>${measurement.rightThigh}</td>
                <td>${measurement.leftCalf}</td>
                <td>${measurement.rightCalf}</td>
                <td>
                    <button class="btn delete-btn" onclick="deleteMeasurement(this)">Delete</button>
                </td>
            `;
    measurementBody.appendChild(row);
}

// Delete measurement
function deleteMeasurement(button) {
    const row = button.closest('tr');
    const date = row.querySelector('td').textContent;

    // Remove from localStorage
    let measurements = JSON.parse(localStorage.getItem('measurements')) || [];
    measurements = measurements.filter(measurement => measurement.date !== date);
    localStorage.setItem('measurements', JSON.stringify(measurements));

    // Remove from table
    row.remove();
}

// Reset form
function resetForm() {
    measurementInputForm.reset();
    isEditing = false;
    measurementForm.style.display = 'none';
}