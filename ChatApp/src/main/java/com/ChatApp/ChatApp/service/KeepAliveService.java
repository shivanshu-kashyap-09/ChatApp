package com.ChatApp.ChatApp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeepAliveService {
    private static final Logger logger = LoggerFactory.getLogger(KeepAliveService.class);
    private final RestTemplate restTemplate;

    @Value("${app.render.url:http://localhost:8080}")
    private String appUrl;

    public KeepAliveService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Ping every 10 minutes (600,000 ms) to keep Render instance awake
    @Scheduled(fixedRate = 600000)
    public void keepAlive() {
        try {
            String url = appUrl + "/ping";
            logger.info("Sending keep-alive ping to: {}", url);
            String response = restTemplate.getForObject(url, String.class);
            logger.info("Keep-alive response: {}", response);
        } catch (Exception e) {
            logger.error("Failed to send keep-alive ping: {}", e.getMessage());
        }
    }
}
