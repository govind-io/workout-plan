let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");
const progressBar = document.getElementById("progress");
const loadingOverlay = document.getElementById("loadingOverlay");
const randomFactElement = document.getElementById("randomFact");

// Workout facts to display during loading
const workoutFacts = [
  "Stay hydrated during your workout.",
  "Consistency is the key to fitness success.",
  "Strength training helps build lean muscle.",
  "Stretching improves flexibility and reduces injury.",
  "A balanced diet fuels your workout.",
  "Warm-up exercises prepare your body for action.",
  "Cool down after workouts to ease muscle recovery.",
  "Rest days are essential for muscle growth.",
  "Proper form is more important than heavy weights.",
  "Set realistic fitness goals to stay motivated.",
];

// Show the first step
formSteps[currentStep].classList.add("active");
updateProgressBar();

// Function to go to the next step
function nextStep() {
  if (currentStep < formSteps.length - 1) {
    formSteps[currentStep].classList.remove("active");
    currentStep++;
    formSteps[currentStep].classList.add("active");
    updateProgressBar();
  }
}

// Function to go to the previous step
function prevStep() {
  if (currentStep > 0) {
    formSteps[currentStep].classList.remove("active");
    currentStep--;
    formSteps[currentStep].classList.add("active");
    updateProgressBar();
  }
}

// Update the progress bar width based on the current step
function updateProgressBar() {
  const progressPercentage = ((currentStep + 1) / formSteps.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

// Function to show loading overlay and cycle facts
function showLoadingOverlay() {
  loadingOverlay.classList.add("active");
  let factIndex = 0;

  // Change fact every 3 seconds
  const factInterval = setInterval(() => {
    randomFactElement.textContent = workoutFacts[factIndex];
    factIndex = (factIndex + 1) % workoutFacts.length;
  }, 1000);

  return factInterval;
}

// Hide the loading overlay
function hideLoadingOverlay(factInterval) {
  clearInterval(factInterval);
  loadingOverlay.classList.remove("active");
}

const form = document.getElementById("fitnessForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Display the loading overlay and start showing random facts
  const factInterval = showLoadingOverlay();

  // Gather form data
  const formData = {
    weight: document.getElementById("weight").value,
    height: document.getElementById("height").value,
    chest: document.getElementById("chest").value,
    waist: document.getElementById("waist").value,
    hips: document.getElementById("hips").value,
    neck: document.getElementById("neck").value,
    leftArm: document.getElementById("leftArm").value,
    rightArm: document.getElementById("rightArm").value,
    leftThigh: document.getElementById("leftThigh").value,
    rightThigh: document.getElementById("rightThigh").value,
    leftCalf: document.getElementById("leftCalf").value,
    rightCalf: document.getElementById("rightCalf").value,
    diet: document.getElementById("diet").value,
    intensity: document.getElementById("intensity").value,
    profession: document.getElementById("profession").value,
    bmi: calculateBMI(
      document.getElementById("weight").value,
      document.getElementById("height").value
    ),
    bodyFat: calculateBodyFatPercentageSI(
      document.getElementById("waist").value,
      document.getElementById("neck").value,
      document.getElementById("height").value
    ),
  };

  try {
    // Send data to the backend API
    const response = await fetch(
      "http://localhost:3000/generate-fitness-plan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("fitnessPlan", data.html);
      window.location.href = "/fitness-plan";
    } else {
      alert("Failed to submit data. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while submitting the form.");
  } finally {
    hideLoadingOverlay(factInterval); // Hide overlay once done
  }
});
