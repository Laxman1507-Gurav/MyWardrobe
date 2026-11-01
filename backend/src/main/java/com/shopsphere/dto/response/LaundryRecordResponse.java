package com.shopsphere.dto.response;

import java.time.LocalDateTime;

public class LaundryRecordResponse {

    private Long id;
    private Long clothingItemId;
    private String clothingItemName;
    private String clothingItemImage;
    private String categoryName;
    private String primaryColour;
    private String washingInstructions;
    private String status;
    private LocalDateTime recordedAt;
    private String notes;

    public LaundryRecordResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClothingItemId() { return clothingItemId; }
    public void setClothingItemId(Long clothingItemId) { this.clothingItemId = clothingItemId; }

    public String getClothingItemName() { return clothingItemName; }
    public void setClothingItemName(String clothingItemName) { this.clothingItemName = clothingItemName; }

    public String getClothingItemImage() { return clothingItemImage; }
    public void setClothingItemImage(String clothingItemImage) { this.clothingItemImage = clothingItemImage; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getPrimaryColour() { return primaryColour; }
    public void setPrimaryColour(String primaryColour) { this.primaryColour = primaryColour; }

    public String getWashingInstructions() { return washingInstructions; }
    public void setWashingInstructions(String washingInstructions) { this.washingInstructions = washingInstructions; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

