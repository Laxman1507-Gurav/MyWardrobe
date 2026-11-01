package com.shopsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OutfitItemRequest {

    @NotNull(message = "Clothing item ID is required")
    private Long clothingItemId;

    @NotBlank(message = "Outfit slot is required (TOP, BOTTOM, OUTERWEAR, FOOTWEAR, ACCESSORY)")
    private String outfitSlot;

    private Integer displayOrder = 0;

    public OutfitItemRequest() {}

    public OutfitItemRequest(Long clothingItemId, String outfitSlot, Integer displayOrder) {
        this.clothingItemId = clothingItemId;
        this.outfitSlot = outfitSlot;
        this.displayOrder = displayOrder;
    }

    public Long getClothingItemId() { return clothingItemId; }
    public void setClothingItemId(Long clothingItemId) { this.clothingItemId = clothingItemId; }

    public String getOutfitSlot() { return outfitSlot; }
    public void setOutfitSlot(String outfitSlot) { this.outfitSlot = outfitSlot; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}

