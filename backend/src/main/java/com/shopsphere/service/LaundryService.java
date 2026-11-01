package com.shopsphere.service;

import com.shopsphere.dto.request.LaundryActionRequest;
import com.shopsphere.dto.response.ClothingItemResponse;
import com.shopsphere.dto.response.LaundryRecordResponse;
import com.shopsphere.entity.ClothingItem;
import com.shopsphere.entity.LaundryRecord;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.ClothingRepository;
import com.shopsphere.repository.LaundryRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LaundryService {

    private final LaundryRepository laundryRepository;
    private final ClothingRepository clothingRepository;
    private final UserRepository userRepository;
    private final ClothingService clothingService;

    public LaundryService(LaundryRepository laundryRepository,
                          ClothingRepository clothingRepository,
                          UserRepository userRepository,
                          ClothingService clothingService) {
        this.laundryRepository = laundryRepository;
        this.clothingRepository = clothingRepository;
        this.userRepository = userRepository;
        this.clothingService = clothingService;
    }

    @Transactional
    public LaundryRecordResponse logLaundryAction(Long userId, LaundryActionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ClothingItem item = clothingRepository.findByIdAndUserId(request.getClothingItemId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clothing item not found with id: " + request.getClothingItemId()));

        String status = request.getStatus();
        if ("CLEANED".equalsIgnoreCase(status) || "AVAILABLE".equalsIgnoreCase(status)) {
            item.setAvailabilityStatus("AVAILABLE");
            status = "CLEANED";
        } else {
            item.setAvailabilityStatus("IN_LAUNDRY");
            status = "SENT_TO_LAUNDRY";
        }
        clothingRepository.save(item);

        LaundryRecord record = new LaundryRecord(user, item, status, request.getNotes());
        LaundryRecord saved = laundryRepository.save(record);
        return mapToResponse(saved);
    }

    @Transactional
    public ClothingItemResponse markClean(Long userId, Long clothingItemId) {
        ClothingItem item = clothingRepository.findByIdAndUserId(clothingItemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clothing item not found with id: " + clothingItemId));

        item.setAvailabilityStatus("AVAILABLE");
        clothingRepository.save(item);

        User user = item.getUser();
        LaundryRecord record = new LaundryRecord(user, item, "CLEANED", "Marked clean & returned to closet");
        laundryRepository.save(record);

        return clothingService.getClothingItem(userId, clothingItemId);
    }

    @Transactional(readOnly = true)
    public List<LaundryRecordResponse> getLaundryHistory(Long userId) {
        List<LaundryRecord> records = laundryRepository.findByUserIdOrderByRecordedAtDesc(userId);
        return records.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private LaundryRecordResponse mapToResponse(LaundryRecord r) {
        LaundryRecordResponse res = new LaundryRecordResponse();
        res.setId(r.getId());
        res.setClothingItemId(r.getClothingItem().getId());
        res.setClothingItemName(r.getClothingItem().getName());
        res.setClothingItemImage(r.getClothingItem().getImagePath());
        res.setCategoryName(r.getClothingItem().getCategory() != null ? r.getClothingItem().getCategory().getName() : "");
        res.setPrimaryColour(r.getClothingItem().getPrimaryColour());
        res.setWashingInstructions(r.getClothingItem().getWashingInstructions());
        res.setStatus(r.getStatus());
        res.setRecordedAt(r.getRecordedAt());
        res.setNotes(r.getNotes());
        return res;
    }
}

