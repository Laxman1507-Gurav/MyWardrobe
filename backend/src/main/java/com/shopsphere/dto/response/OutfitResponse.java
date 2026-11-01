package com.shopsphere.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OutfitResponse {

    private Long id;
    private String name;
    private String occasion;
    private String season;
    private String style;
    private String notes;
    private Boolean isFavourite;
    private List<OutfitItemResponse> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OutfitResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getIsFavourite() { return isFavourite; }
    public void setIsFavourite(Boolean favourite) { isFavourite = favourite; }

    public List<OutfitItemResponse> getItems() { return items; }
    public void setItems(List<OutfitItemResponse> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

