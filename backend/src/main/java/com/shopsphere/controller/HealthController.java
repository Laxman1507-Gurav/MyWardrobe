package com.shopsphere.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("application", "MyWardrobe — Your Personal Digital Wardrobe");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now().toString());

        try {
            Integer dbPing = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            Integer catCount = jdbcTemplate.queryForObject("SELECT count(*) FROM clothing_categories", Integer.class);
            status.put("database", "CONNECTED");
            status.put("dbPing", dbPing);
            status.put("seededCategories", catCount);
        } catch (Exception e) {
            status.put("database", "ERROR: " + e.getMessage());
        }

        return ResponseEntity.ok(status);
    }
}
