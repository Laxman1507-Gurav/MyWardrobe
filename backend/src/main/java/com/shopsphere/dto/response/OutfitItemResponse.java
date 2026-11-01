package com.shopsphere.dto.response;

public class OutfitItemResponse {

    private Long id;
    private Long clothingItemId;
    private String clothingItemName;
    private String clothingItemImage;
    private String primaryColour;
    private String brand;
    private String categoryName;
    private String categoryCode;
    private String outfitSlot;
    private Integer displayOrder;

    public OutfitItemResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClothingItemId() { return clothingItemId; }
    public void setClothingItemId(Long clothingItemId) { this.clothingItemId = clothingItemId; }

    public String getClothingItemName() { return clothingItemName; }
    public void setClothingItemName(String clothingItemName) { this.clothingItemName = clothingItemName; }

    public String getClothingItemImage() { return clothingItemImage; }
    public void setClothingItemImage(String clothingItemImage) { this.clothingItemImage = clothingItemImage; }

    public String getPrimaryColour() { return primaryColour; }
    public void setPrimaryColour(String primaryColour) { this.primaryColour = primaryColour; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryCode() { return categoryCode; }
    public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }

    public String getOutfitSlot() { return outfitSlot; }
    public void setOutfitSlot(String outfitSlot) { this.outfitSlot = outfitSlot; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}

