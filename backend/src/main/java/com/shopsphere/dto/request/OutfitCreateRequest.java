package com.shopsphere.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.ArrayList;
import java.util.List;

public class OutfitCreateRequest {

    @NotBlank(message = "Outfit name is required")
    private String name;

    @NotBlank(message = "Occasion is required")
    private String occasion;

    private String season = "ALL_SEASON";
    private String style = "CASUAL";
    private String notes;
    private Boolean isFavourite = false;

    @NotEmpty(message = "An outfit must have at least one clothing item")
    @Valid
    private List<OutfitItemRequest> items = new ArrayList<>();

    public OutfitCreateRequest() {}

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

    public List<OutfitItemRequest> getItems() { return items; }
    public void setItems(List<OutfitItemRequest> items) { this.items = items; }
}

