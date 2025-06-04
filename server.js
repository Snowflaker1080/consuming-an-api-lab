require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let weatherData = null; // Temporary store for weather data between redirects

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Show weather results
app.get("/weather/show", (req, res) => {
  if (!weatherData) return res.redirect("/");
  res.render("weather/show", { weather: weatherData });
});

// POST for ZIP code
app.post("/weather/zip", async (req, res) => {
  const zip = req.body.zip;
  const apiKey = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // convert values
    const tempF = data.main.temp;
    const tempC = ((tempF - 32) * 5) / 9;

    const windMph = data.wind.speed;
    const windKph = windMph * 1.60934;

    const pressureHpa = data.main.pressure;
    const pressureInHg = pressureHpa * 0.02953;

    weatherData = {
      name: data.name,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      tempF,
      tempC: tempC.toFixed(1),
      humidity: data.main.humidity,
      pressureHpa,
      pressureInHg: pressureInHg.toFixed(0),
      windMph,
      windKph: windKph.toFixed(1),
    };

    res.redirect("/weather/show");
  } catch (error) {
    console.error("Zip Error:", error.message);
    res.send("Error retrieving by ZIP. Please try again.");
  }
});

// POST for city/state/country
app.post("/weather/location", async (req, res) => {
  const { city, state, country } = req.body;
  const apiKey = process.env.API_KEY;
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${apiKey}`;

  try {
    const geoRes = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (!geoData.length) throw new Error("Location not found");

    const { lat, lon, name } = geoData[0];

    // Use co-ordinates to get weather
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherRes = await fetch(weatherURL);
    const data = await weatherRes.json();

     weatherData = {
      name: name,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      tempF: ((data.main.temp * 9) / 5 + 32).toFixed(1),
      tempC: data.main.temp.toFixed(1),
      humidity: data.main.humidity,
      pressureHpa: data.main.pressure,
      pressureInHg: (data.main.pressure * 0.02953).toFixed(1),
      windMph: (data.wind.speed / 1.60934).toFixed(1),
      windKph: data.wind.speed.toFixed(1),
    };

      res.redirect("/weather/show");
  } catch (error) {
    console.error("Location Error:", error.message);
    res.send("Error retrieving weather by location. Try again.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log("Server running at http://localhost:${PORT}");
});
