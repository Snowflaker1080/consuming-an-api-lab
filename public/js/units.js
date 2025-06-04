let isMetric = false;

// Apply saved unit preference on page load
function applyStoredPreference() {
  const savedUnit = localStorage.getItem('unit');
  if (savedUnit === 'metric') {
    isMetric = true;
    toggleUnits(true); // Apply silently without flipping
  }
}

// Update toggle button text
function updateButtonLabel() {
  const toggleBtn = document.querySelector('#toggleBtn');
  if (toggleBtn) {
    toggleBtn.textContent = isMetric ? 'Switch to Imperial (°F)' : 'Switch to Metric (°C)';
  }
}

function animateSwap(el, newText) {
  el.classList.add("unit-fade-out");

  // Wait for fade out
  setTimeout(() => {
    el.textContent = newText;
    el.classList.remove("unit-fade-out");
    el.classList.add("unit-fade-in");

    // Remove fade-in class after animation completes
    setTimeout(() => {
      el.classList.remove("unit-fade-in");
    }, 300);
  }, 300);
}

function toggleUnits(init = false) {
  if (!init) isMetric = !isMetric;

  const tempEl = document.querySelector('#temp span');
  const pressureEl = document.querySelector('#pressure span');
  const windEl = document.querySelector('#wind span');

  if (tempEl) {
    const tempF = parseFloat(tempEl.dataset.f);
    const tempC = parseFloat(tempEl.dataset.c);
    const newTemp = isMetric ? `${tempC} °C` : `${tempF} °F`;
    animateSwap(tempEl, newTemp);
  }

  if (pressureEl) {
    const pressureHpa = parseFloat(pressureEl.dataset.hpa); //hectopascal(hPa)
    const pressureInHg = parseFloat(pressureEl.dataset.inhg); //inches of mercury(inHg)
    const newPressure = isMetric ? `${pressureHpa} hPa`:`${pressureInHg} inHg`;
    animateSwap(pressureEl, newPressure);
  }

  if (windEl) {
    const windMph = parseFloat(windEl.dataset.mph);
    const windKph = parseFloat(windEl.dataset.kph);
    const newWind = isMetric ? `${windKph} km/h` : `${windMph} mph`;
    animateSwap(windEl, newWind);
  }

  if (!init) {
    localStorage.setItem('unit', isMetric ? 'metric' : 'imperial');
  }

  updateButtonLabel();
}

// Make toggleUnits available to inline onclick="toggleUnits()" works.
window.toggleUnits = toggleUnits;
// Run on page load
document.addEventListener('DOMContentLoaded', applyStoredPreference);