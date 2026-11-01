package com.shopsphere.controller;

import com.shopsphere.dto.request.ClothingItemRequest;
import com.shopsphere.dto.response.ClothingItemResponse;
import com.shopsphere.entity.ClothingCategory;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.ClothingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clothing")
public class ClothingController {

    private final ClothingService clothingService;

    public ClothingController(ClothingService clothingService) {
        this.clothingService = clothingService;
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ClothingItemResponse> createClothingItem(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestPart("data") @Valid ClothingItemRequest request,
            @RequestPart("image") MultipartFile imageFile) {
        ClothingItemResponse response = clothingService.createClothingItem(currentUser.getId(), request, imageFile);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ClothingItemResponse>> getClothingItems(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) Boolean isFavourite,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy) {
        List<ClothingItemResponse> items = clothingService.getClothingItems(
                currentUser.getId(), categoryId, availability, isFavourite, season, style, query, sortBy
        );
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClothingItemResponse> getClothingItem(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        ClothingItemResponse item = clothingService.getClothingItem(currentUser.getId(), id);
        return ResponseEntity.ok(item);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ClothingItemResponse> updateClothingItem(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestPart("data") @Valid ClothingItemRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        ClothingItemResponse response = clothingService.updateClothingItem(currentUser.getId(), id, request, imageFile);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteClothingItem(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        clothingService.deleteClothingItem(currentUser.getId(), id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Clothing item deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ClothingItemResponse> toggleFavorite(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        ClothingItemResponse response = clothingService.toggleFavorite(currentUser.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/availability")
    public ResponseEntity<ClothingItemResponse> updateAvailability(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestParam String status) {
        ClothingItemResponse response = clothingService.updateAvailability(currentUser.getId(), id, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ClothingCategory>> getCategories() {
        return ResponseEntity.ok(clothingService.getAllCategories());
    }
}
