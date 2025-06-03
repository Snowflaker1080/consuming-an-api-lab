// api.openweathermap.org/data/2.5/weather?zip=[ZIP CODE],us&units=imperial&appid=[API KEY]

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let weatherData = null; // Temporary store for weather data between redirects

// Home page route
app.get("/", (req, res) => {
  res.render("index");
});

// POST /weather route
app.post("/weather", async (req, res) => {
  const zip = req.body.zip;
  const apiKey = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${apiKey}`;
  console.log("API KEY:", process.env.API_KEY);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather data");
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
      pressureInHg: pressureInHg.toFixed(2),
      windMph,
      windKph: windKph.toFixed(1),
    };

    res.redirect("/weather/show");
  } catch (error) {
    console.error(error.message);
    res.send("Error retrieving weather data. Please try again.");
  }
});

// Get /weather/show route
app.get("/weather/show", (req, res) => {
  if (!weatherData) {
    return res.redirect("/");
  }

  res.render("weather/show", { weather: weatherData });
});

// Start server
app.listen(PORT, () => {
  console.log("Server running at http://localhost:${PORT}");
});
