package com.shopsphere.controller;

import com.shopsphere.dto.response.AnalyticsOverviewResponse;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<AnalyticsOverviewResponse> getOverview(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        AnalyticsOverviewResponse overview = analyticsService.getOverview(currentUser.getId());
        return ResponseEntity.ok(overview);
    }
}

