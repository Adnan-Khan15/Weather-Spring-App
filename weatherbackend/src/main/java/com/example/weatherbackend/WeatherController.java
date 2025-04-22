package com.example.weatherbackend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for React frontend
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private static final Logger logger = LoggerFactory.getLogger(WeatherController.class);
    
    @Autowired
    private WeatherService weatherService;

    @GetMapping("/{city}")
    public ResponseEntity<?> getWeather(@PathVariable String city) {
        try {
            // Input validation
            if (city == null || city.trim().isEmpty()) {
                logger.warn("Empty city parameter received");
                return ResponseEntity.badRequest().body("City name cannot be empty");
            }

            logger.info("Fetching weather for city: {}", city);
            String weatherData = weatherService.getWeather(city);
            
            return ResponseEntity.ok(weatherData);
            
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
            
        } catch (RuntimeException e) {
            logger.error("Error fetching weather data: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                "City does not exist"
            );
        }
    }
}