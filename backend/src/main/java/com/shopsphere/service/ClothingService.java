package com.shopsphere.service;

import com.shopsphere.dto.request.ClothingItemRequest;
import com.shopsphere.dto.response.ClothingItemResponse;
import com.shopsphere.entity.ClothingCategory;
import com.shopsphere.entity.ClothingItem;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ClothingRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.storage.FileStorageService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClothingService {

    private final ClothingRepository clothingRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final FileStorageService storageService;

    public ClothingService(ClothingRepository clothingRepository,
                           CategoryRepository categoryRepository,
                           UserRepository userRepository,
                           FileStorageService storageService) {
        this.clothingRepository = clothingRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    @Transactional
    public ClothingItemResponse createClothingItem(Long userId, ClothingItemRequest request, MultipartFile imageFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ClothingCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String imagePath = storageService.storeFile(imageFile);

        ClothingItem item = new ClothingItem();
        item.setUser(user);
        item.setCategory(category);
        item.setName(request.getName().trim());
        item.setImagePath(imagePath);
        item.setPrimaryColour(request.getPrimaryColour());
        item.setSecondaryColour(request.getSecondaryColour());
        item.setPattern(request.getPattern());
        item.setBrand(request.getBrand());
        item.setFabric(request.getFabric());
        item.setSeason(request.getSeason() != null ? request.getSeason() : "ALL_SEASON");
        item.setStyle(request.getStyle() != null ? request.getStyle() : "CASUAL");
        item.setPurchaseDate(request.getPurchaseDate());
        item.setPurchasePrice(request.getPurchasePrice());
        item.setAvailabilityStatus(request.getAvailabilityStatus() != null ? request.getAvailabilityStatus() : "AVAILABLE");
        item.setIsFavourite(request.getIsFavourite() != null ? request.getIsFavourite() : false);
        item.setWashingInstructions(request.getWashingInstructions());
        item.setNotes(request.getNotes());
        if (request.getOccasions() != null) {
            item.setOccasions(request.getOccasions());
        }

        ClothingItem savedItem = clothingRepository.save(item);
        return mapToResponse(savedItem);
    }

    @Transactional(readOnly = true)
    public List<ClothingItemResponse> getClothingItems(Long userId,
                                                       Long categoryId,
                                                       String availability,
                                                       Boolean isFavourite,
                                                       String season,
                                                       String style,
                                                       String query,
                                                       String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("name".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "name");
        } else if ("purchasePrice".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "purchasePrice");
        } else if ("purchaseDate".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "purchaseDate");
        }

        List<ClothingItem> items = clothingRepository.searchItems(
                userId, categoryId, availability, isFavourite, season, style, query, sort
        );

        return items.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClothingItemResponse getClothingItem(Long userId, Long itemId) {
        ClothingItem item = clothingRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clothing item not found with id: " + itemId));
        return mapToResponse(item);
    }

    @Transactional
    public ClothingItemResponse updateClothingItem(Long userId, Long itemId, ClothingItemRequest request, MultipartFile imageFile) {
        ClothingItem item = clothingRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clothing item not found with id: " + itemId));

        if (request.getCategoryId() != null && !request.getCategoryId().equals(item.getCategory().getId())) {
            ClothingCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            item.setCategory(category);
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            String oldImage = item.getImagePath();
            String newImage = storageService.storeFile(imageFile);
            item.setImagePath(newImage);
            storageService.deleteFile(oldImage);
        }

        item.setName(request.getName().trim());
        item.setPrimaryColour(request.getPrimaryColour());
        item.setSecondaryColour(request.getSecondaryColour());
        item.setPattern(request.getPattern());
        item.setBrand(request.getBrand());
        item.setFabric(request.getFabric());
        item.setSeason(request.getSeason());
        item.setStyle(request.getStyle());
        item.setPurchaseDate(request.getPurchaseDate());
        item.setPurchasePrice(request.getPurchasePrice());
        item.setAvailabilityStatus(request.getAvailabilityStatus());
        item.setIsFavourite(request.getIsFavourite());
        item.setWashingInstructions(request.getWashingInstructions());
        item.setNotes(request.getNotes());
        if (request.getOccasions() != null) {
            item.setOccasions(request.getOccasions());
        }

        ClothingItem updatedItem = clothingRepository.save(item);
        return mapToResponse(updatedItem);
    }

    @Transactional
    public void deleteClothingItem(Long userId, Long itemId) {
        ClothingItem item = clothingRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clothing item not found with id: " + itemId));

        String imagePath = item.getImagePath();
        clothingRepository.delete(item);
        storageService.deleteFile(imagePath);
    }

    @Transactional
    public ClothingItemResponse toggleFavorite(Long userId, Long itemId) {
        ClothingItem item = clothingRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clothing item not found with id: " + itemId));

        item.setIsFavourite(!item.getIsFavourite());
        return mapToResponse(clothingRepository.save(item));
    }

    @Transactional
    public ClothingItemResponse updateAvailability(Long userId, Long itemId, String newStatus) {
        ClothingItem item = clothingRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Clothing item not found with id: " + itemId));

        item.setAvailabilityStatus(newStatus);
        return mapToResponse(clothingRepository.save(item));
    }

    public List<ClothingCategory> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc();
    }

    private ClothingItemResponse mapToResponse(ClothingItem item) {
        ClothingItemResponse res = new ClothingItemResponse();
        res.setId(item.getId());
        res.setCategoryId(item.getCategory().getId());
        res.setCategoryName(item.getCategory().getName());
        res.setCategoryCode(item.getCategory().getCode());
        res.setName(item.getName());
        res.setImagePath(item.getImagePath());
        res.setPrimaryColour(item.getPrimaryColour());
        res.setSecondaryColour(item.getSecondaryColour());
        res.setPattern(item.getPattern());
        res.setBrand(item.getBrand());
        res.setFabric(item.getFabric());
        res.setSeason(item.getSeason());
        res.setStyle(item.getStyle());
        res.setPurchaseDate(item.getPurchaseDate());
        res.setPurchasePrice(item.getPurchasePrice());
        res.setAvailabilityStatus(item.getAvailabilityStatus());
        res.setIsFavourite(item.getIsFavourite());
        res.setWashingInstructions(item.getWashingInstructions());
        res.setNotes(item.getNotes());
        res.setOccasions(item.getOccasions());
        res.setCreatedAt(item.getCreatedAt());
        res.setUpdatedAt(item.getUpdatedAt());
        return res;
    }
}
