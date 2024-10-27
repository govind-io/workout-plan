document.addEventListener("DOMContentLoaded", () => {
  const fitnessPlan = localStorage.getItem("fitnessPlan");

  if (fitnessPlan) {
    document.body.innerHTML = `
    ${fitnessPlan} 
    <a href="Fitness Tracker.html" class="link">
        Go to Fitness Measurement Tracker
    </a>
    `;
  } else {
    window.location.href = "/Fitness Plan Generator.html";
  }
});
