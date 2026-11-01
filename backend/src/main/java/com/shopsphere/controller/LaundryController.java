package com.shopsphere.controller;

import com.shopsphere.dto.request.LaundryActionRequest;
import com.shopsphere.dto.response.ClothingItemResponse;
import com.shopsphere.dto.response.LaundryRecordResponse;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.LaundryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laundry")
public class LaundryController {

    private final LaundryService laundryService;

    public LaundryController(LaundryService laundryService) {
        this.laundryService = laundryService;
    }

    @PostMapping("/action")
    public ResponseEntity<LaundryRecordResponse> logAction(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody LaundryActionRequest request) {
        return ResponseEntity.ok(laundryService.logLaundryAction(currentUser.getId(), request));
    }

    @PostMapping("/{clothingItemId}/clean")
    public ResponseEntity<ClothingItemResponse> markClean(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long clothingItemId) {
        return ResponseEntity.ok(laundryService.markClean(currentUser.getId(), clothingItemId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<LaundryRecordResponse>> getHistory(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(laundryService.getLaundryHistory(currentUser.getId()));
    }
}

