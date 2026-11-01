package com.shopsphere.service;

import com.shopsphere.dto.request.LoginRequest;
import com.shopsphere.dto.request.RegisterRequest;
import com.shopsphere.dto.request.UserPreferencesRequest;
import com.shopsphere.dto.response.AuthResponse;
import com.shopsphere.dto.response.UserResponse;
import com.shopsphere.entity.User;
import com.shopsphere.entity.UserPreferences;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.UserPreferencesRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.security.JwtTokenProvider;
import com.shopsphere.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserPreferencesRepository preferencesRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       UserPreferencesRepository preferencesRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.preferencesRepository = preferencesRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirmation password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email address is already in use");
        }

        User user = new User(
                request.getFullName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        // Seed default preferences
        UserPreferences preferences = new UserPreferences(savedUser);
        preferencesRepository.save(preferences);

        // Authenticate automatically upon registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), savedUser.getRole(), savedUser.getAvatarUrl());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(jwt, user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getAvatarUrl());
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserPreferences preferences = preferencesRepository.findByUserId(userId)
                .orElse(new UserPreferences(user));

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setPreferredStyles(preferences.getPreferredStyles());
        response.setPreferredColours(preferences.getPreferredColours());
        response.setPreferredOccasions(preferences.getPreferredOccasions());

        return response;
    }

    @Transactional
    public UserResponse updatePreferences(Long userId, UserPreferencesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserPreferences preferences = preferencesRepository.findByUserId(userId)
                .orElseGet(() -> new UserPreferences(user));

        if (request.getPreferredStyles() != null) preferences.setPreferredStyles(request.getPreferredStyles());
        if (request.getPreferredColours() != null) preferences.setPreferredColours(request.getPreferredColours());
        if (request.getPreferredOccasions() != null) preferences.setPreferredOccasions(request.getPreferredOccasions());

        preferencesRepository.save(preferences);
        return getCurrentUser(userId);
    }
}
