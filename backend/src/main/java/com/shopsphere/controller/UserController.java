package com.shopsphere.controller;

import com.shopsphere.dto.request.UserPreferencesRequest;
import com.shopsphere.dto.response.UserResponse;
import com.shopsphere.entity.User;
import com.shopsphere.entity.UserPreferences;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.UserPreferencesRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final UserPreferencesRepository userPreferencesRepository;

    public UserController(UserRepository userRepository, UserPreferencesRepository userPreferencesRepository) {
        this.userRepository = userRepository;
        this.userPreferencesRepository = userPreferencesRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUser.getId()));

        UserPreferences prefs = userPreferencesRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserPreferences(user));

        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setFullName(user.getFullName());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole());
        res.setAvatarUrl(user.getAvatarUrl());
        res.setPreferredStyles(prefs.getPreferredStyles());
        res.setPreferredColours(prefs.getPreferredColours());
        res.setPreferredOccasions(prefs.getPreferredOccasions());

        return ResponseEntity.ok(res);
    }

    @PutMapping("/preferences")
    public ResponseEntity<UserResponse> updatePreferences(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UserPreferencesRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUser.getId()));

        UserPreferences prefs = userPreferencesRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserPreferences p = new UserPreferences(user);
                    return p;
                });

        if (request.getPreferredStyles() != null) prefs.setPreferredStyles(request.getPreferredStyles());
        if (request.getPreferredColours() != null) prefs.setPreferredColours(request.getPreferredColours());
        if (request.getPreferredOccasions() != null) prefs.setPreferredOccasions(request.getPreferredOccasions());
        userPreferencesRepository.save(prefs);

        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setFullName(user.getFullName());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole());
        res.setAvatarUrl(user.getAvatarUrl());
        res.setPreferredStyles(prefs.getPreferredStyles());
        res.setPreferredColours(prefs.getPreferredColours());
        res.setPreferredOccasions(prefs.getPreferredOccasions());

        return ResponseEntity.ok(res);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUser.getId()));

        if (body.containsKey("fullName") && body.get("fullName") != null && !body.get("fullName").isBlank()) {
            user.setFullName(body.get("fullName").trim());
        }
        if (body.containsKey("avatarUrl")) {
            user.setAvatarUrl(body.get("avatarUrl"));
        }
        userRepository.save(user);

        return getProfile(currentUser);
    }
}

