package com.shopsphere.service;

import com.shopsphere.dto.request.OutfitCreateRequest;
import com.shopsphere.dto.request.OutfitItemRequest;
import com.shopsphere.dto.response.OutfitItemResponse;
import com.shopsphere.dto.response.OutfitResponse;
import com.shopsphere.entity.ClothingItem;
import com.shopsphere.entity.Outfit;
import com.shopsphere.entity.OutfitItem;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.ClothingRepository;
import com.shopsphere.repository.OutfitItemRepository;
import com.shopsphere.repository.OutfitRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OutfitService {

    private final OutfitRepository outfitRepository;
    private final OutfitItemRepository outfitItemRepository;
    private final ClothingRepository clothingRepository;
    private final UserRepository userRepository;

    public OutfitService(OutfitRepository outfitRepository,
                         OutfitItemRepository outfitItemRepository,
                         ClothingRepository clothingRepository,
                         UserRepository userRepository) {
        this.outfitRepository = outfitRepository;
        this.outfitItemRepository = outfitItemRepository;
        this.clothingRepository = clothingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OutfitResponse createOutfit(Long userId, OutfitCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Outfit outfit = new Outfit();
        outfit.setUser(user);
        outfit.setName(request.getName().trim());
        outfit.setOccasion(request.getOccasion());
        outfit.setSeason(request.getSeason() != null ? request.getSeason() : "ALL_SEASON");
        outfit.setStyle(request.getStyle() != null ? request.getStyle() : "CASUAL");
        outfit.setNotes(request.getNotes());
        outfit.setIsFavourite(request.getIsFavourite() != null ? request.getIsFavourite() : false);

        int order = 1;
        for (OutfitItemRequest itemReq : request.getItems()) {
            ClothingItem clothingItem = clothingRepository.findByIdAndUserId(itemReq.getClothingItemId(), userId)
                    .orElseThrow(() -> new BadRequestException("Clothing item not found with id: " + itemReq.getClothingItemId()));

            OutfitItem oi = new OutfitItem();
            oi.setOutfit(outfit);
            oi.setClothingItem(clothingItem);
            oi.setOutfitSlot(itemReq.getOutfitSlot());
            oi.setDisplayOrder(itemReq.getDisplayOrder() != null ? itemReq.getDisplayOrder() : order++);
            outfit.addItem(oi);
        }

        Outfit saved = outfitRepository.save(outfit);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OutfitResponse> getOutfits(Long userId, String occasion, String season, String query, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("name".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "name");
        }

        List<Outfit> list = outfitRepository.searchOutfits(userId, occasion, season, query, sort);
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OutfitResponse getOutfit(Long userId, Long outfitId) {
        Outfit outfit = outfitRepository.findByIdAndUserId(outfitId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Outfit not found with id: " + outfitId));
        return mapToResponse(outfit);
    }

    @Transactional
    public OutfitResponse updateOutfit(Long userId, Long outfitId, OutfitCreateRequest request) {
        Outfit outfit = outfitRepository.findByIdAndUserId(outfitId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Outfit not found with id: " + outfitId));

        outfit.setName(request.getName().trim());
        outfit.setOccasion(request.getOccasion());
        outfit.setSeason(request.getSeason());
        outfit.setStyle(request.getStyle());
        outfit.setNotes(request.getNotes());
        if (request.getIsFavourite() != null) {
            outfit.setIsFavourite(request.getIsFavourite());
        }

        outfit.getItems().clear();
        int order = 1;
        for (OutfitItemRequest itemReq : request.getItems()) {
            ClothingItem clothingItem = clothingRepository.findByIdAndUserId(itemReq.getClothingItemId(), userId)
                    .orElseThrow(() -> new BadRequestException("Clothing item not found with id: " + itemReq.getClothingItemId()));

            OutfitItem oi = new OutfitItem();
            oi.setOutfit(outfit);
            oi.setClothingItem(clothingItem);
            oi.setOutfitSlot(itemReq.getOutfitSlot());
            oi.setDisplayOrder(itemReq.getDisplayOrder() != null ? itemReq.getDisplayOrder() : order++);
            outfit.addItem(oi);
        }

        Outfit updated = outfitRepository.save(outfit);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteOutfit(Long userId, Long outfitId) {
        Outfit outfit = outfitRepository.findByIdAndUserId(outfitId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Outfit not found with id: " + outfitId));
        outfitRepository.delete(outfit);
    }

    @Transactional
    public OutfitResponse toggleFavorite(Long userId, Long outfitId) {
        Outfit outfit = outfitRepository.findByIdAndUserId(outfitId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Outfit not found with id: " + outfitId));
        outfit.setIsFavourite(!outfit.getIsFavourite());
        return mapToResponse(outfitRepository.save(outfit));
    }

    public OutfitResponse mapToResponse(Outfit outfit) {
        OutfitResponse res = new OutfitResponse();
        res.setId(outfit.getId());
        res.setName(outfit.getName());
        res.setOccasion(outfit.getOccasion());
        res.setSeason(outfit.getSeason());
        res.setStyle(outfit.getStyle());
        res.setNotes(outfit.getNotes());
        res.setIsFavourite(outfit.getIsFavourite());
        res.setCreatedAt(outfit.getCreatedAt());
        res.setUpdatedAt(outfit.getUpdatedAt());

        List<OutfitItemResponse> itemResponses = new ArrayList<>();
        if (outfit.getItems() != null) {
            for (OutfitItem oi : outfit.getItems()) {
                OutfitItemResponse oir = new OutfitItemResponse();
                oir.setId(oi.getId());
                oir.setClothingItemId(oi.getClothingItem().getId());
                oir.setClothingItemName(oi.getClothingItem().getName());
                oir.setClothingItemImage(oi.getClothingItem().getImagePath());
                oir.setPrimaryColour(oi.getClothingItem().getPrimaryColour());
                oir.setBrand(oi.getClothingItem().getBrand());
                oir.setCategoryName(oi.getClothingItem().getCategory() != null ? oi.getClothingItem().getCategory().getName() : "");
                oir.setCategoryCode(oi.getClothingItem().getCategory() != null ? oi.getClothingItem().getCategory().getCode() : "");
                oir.setOutfitSlot(oi.getOutfitSlot());
                oir.setDisplayOrder(oi.getDisplayOrder());
                itemResponses.add(oir);
            }
        }
        res.setItems(itemResponses);
        return res;
    }
}

