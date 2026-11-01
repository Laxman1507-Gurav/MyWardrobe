package com.shopsphere.controller;

import com.shopsphere.dto.request.RecommendationFilterRequest;
import com.shopsphere.dto.response.RecommendationResponse;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/generate")
    public ResponseEntity<List<RecommendationResponse>> generateRecommendations(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody(required = false) RecommendationFilterRequest filter) {
        List<RecommendationResponse> recommendations = recommendationService.generateRecommendations(currentUser.getId(), filter);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String preferredColour) {
        RecommendationFilterRequest filter = new RecommendationFilterRequest();
        filter.setOccasion(occasion);
        filter.setSeason(season);
        filter.setStyle(style);
        filter.setPreferredColour(preferredColour);
        List<RecommendationResponse> recommendations = recommendationService.generateRecommendations(currentUser.getId(), filter);
        return ResponseEntity.ok(recommendations);
    }
}

