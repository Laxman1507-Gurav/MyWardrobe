package com.shopsphere.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LaundryActionRequest {

    @NotNull(message = "Clothing item ID is required")
    private Long clothingItemId;

    @NotBlank(message = "Status is required (SENT_TO_LAUNDRY, CLEANED)")
    private String status;

    private String notes;

    public LaundryActionRequest() {}

    public Long getClothingItemId() { return clothingItemId; }
    public void setClothingItemId(Long clothingItemId) { this.clothingItemId = clothingItemId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

