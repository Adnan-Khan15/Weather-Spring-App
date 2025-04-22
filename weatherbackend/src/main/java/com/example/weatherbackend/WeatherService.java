package com.example.weatherbackend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WeatherService {
    
    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);
    
    @Value("${openweather.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric";

    public String getWeather(String city) {
        // Validate API key
        if (apiKey == null || apiKey.trim().isEmpty()) {
            String errorMsg = "OpenWeatherMap API key is not configured! Check application.properties";
            logger.error(errorMsg);
            throw new RuntimeException(errorMsg);
        }

        // Validate city input
        if (city == null || city.trim().isEmpty()) {
            String errorMsg = "City name cannot be empty!";
            logger.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = API_URL
                .replace("{city}", city.trim())
                .replace("{apiKey}", apiKey.trim());

            logger.debug("Calling OpenWeather API with URL: {}", url.replace(apiKey, "***")); // Hide API key in logs

            String response = restTemplate.getForObject(url, String.class);
            
            if (response == null || response.isEmpty()) {
                throw new RuntimeException("Received empty response from OpenWeatherMap");
            }

            logger.debug("API response received for city: {}", city);
            return response;

        } catch (HttpClientErrorException e) {
            String errorMsg = String.format("OpenWeatherMap API error: %s - %s", 
                e.getStatusCode(), e.getResponseBodyAsString());
            logger.error(errorMsg);
            throw new RuntimeException("Failed to fetch weather data: " + e.getStatusCode(), e);

        } catch (Exception e) {
            String errorMsg = "Unexpected error fetching weather data: " + e.getMessage();
            logger.error(errorMsg, e);
            throw new RuntimeException(errorMsg, e);
        }
    }
}