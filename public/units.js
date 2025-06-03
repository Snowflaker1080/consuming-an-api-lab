let isMetric = false;

// Apply saved unit preference on page load
function applyStoredPreference() {
  const savedUnit = localStorage.getItem('unit');
  if (savedUnit === 'metric') {
    isMetric = true;
    toggleUnits(true); // Apply silently without flipping
  }
}
// Main toggle function
function toggleUnits(init = false) {
  if (!init) isMetric = !isMetric;

  const tempEl = document.querySelector('#temp span');
  const pressureEl = document.querySelector('#pressure span');
  const windEl = document.querySelector('#wind span');

  const tempF = parseFloat(tempEl.dataset.f);
  const tempC = parseFloat(tempEl.dataset.c);

  const pressureHpa = parseFloat(pressureEl.dataset.hpa);
  const pressureInHg = parseFloat(pressureEl.dataset.inhg);

  const windMph = parseFloat(windEl.dataset.mph);
  const windKph = parseFloat(windEl.dataset.kph);

  tempEl.textContent = isMetric ? `${tempC} °C` : `${tempF} °F`;
  pressureEl.textContent = isMetric ? `${pressureInHg} inHg` : `${pressureHpa} hPa`;
  windEl.textContent = isMetric ? `${windKph} kph` : `${windMph} mph`;

   if (!init) {
    localStorage.setItem('unit', isMetric ? 'metric' : 'imperial');
  }

  updateButtonLabel();
}
// Update toggle button text
function updateButtonLabel() {
  const toggleBtn = document.querySelector('#toggleBtn');
  if (toggleBtn) {
    toggleBtn.textContent = isMetric ? 'Switch to °F' : 'Switch to °C';
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', applyStoredPreference);

// Make toggleUnits available to inline onclick
window.toggleUnits = toggleUnits;