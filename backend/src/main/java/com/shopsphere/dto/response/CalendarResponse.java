package com.shopsphere.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CalendarResponse {

    private Long id;
    private Long outfitId;
    private String outfitName;
    private OutfitResponse outfit;
    private LocalDate scheduledDate;
    private String occasion;
    private String notes;
    private LocalDateTime createdAt;

    public CalendarResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOutfitId() { return outfitId; }
    public void setOutfitId(Long outfitId) { this.outfitId = outfitId; }

    public String getOutfitName() { return outfitName; }
    public void setOutfitName(String outfitName) { this.outfitName = outfitName; }

    public OutfitResponse getOutfit() { return outfit; }
    public void setOutfit(OutfitResponse outfit) { this.outfit = outfit; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

