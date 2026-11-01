package com.shopsphere.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ScheduleRequest {

    @NotNull(message = "Outfit ID is required")
    private Long outfitId;

    @NotNull(message = "Scheduled date is required")
    private LocalDate scheduledDate;

    private String occasion;
    private String notes;

    public ScheduleRequest() {}

    public Long getOutfitId() { return outfitId; }
    public void setOutfitId(Long outfitId) { this.outfitId = outfitId; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

