package com.shopsphere.controller;

import com.shopsphere.dto.request.OutfitCreateRequest;
import com.shopsphere.dto.response.OutfitResponse;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.OutfitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outfits")
public class OutfitController {

    private final OutfitService outfitService;

    public OutfitController(OutfitService outfitService) {
        this.outfitService = outfitService;
    }

    @PostMapping
    public ResponseEntity<OutfitResponse> createOutfit(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody OutfitCreateRequest request) {
        OutfitResponse response = outfitService.createOutfit(currentUser.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OutfitResponse>> getOutfits(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy) {
        List<OutfitResponse> list = outfitService.getOutfits(currentUser.getId(), occasion, season, query, sortBy);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OutfitResponse> getOutfit(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(outfitService.getOutfit(currentUser.getId(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OutfitResponse> updateOutfit(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody OutfitCreateRequest request) {
        return ResponseEntity.ok(outfitService.updateOutfit(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteOutfit(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        outfitService.deleteOutfit(currentUser.getId(), id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Outfit deleted successfully");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<OutfitResponse> toggleFavorite(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(outfitService.toggleFavorite(currentUser.getId(), id));
    }
}

