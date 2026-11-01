package com.shopsphere.dto.response;

import java.util.ArrayList;
import java.util.List;

public class RecommendationResponse {

    private String name;
    private String occasion;
    private String season;
    private String style;
    private int compatibilityScore; // 0-100
    private String stylistNotes;
    private List<OutfitItemResponse> items = new ArrayList<>();
    private List<String> paletteHarmonies = new ArrayList<>();

    public RecommendationResponse() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public int getCompatibilityScore() { return compatibilityScore; }
    public void setCompatibilityScore(int compatibilityScore) { this.compatibilityScore = compatibilityScore; }

    public String getStylistNotes() { return stylistNotes; }
    public void setStylistNotes(String stylistNotes) { this.stylistNotes = stylistNotes; }

    public List<OutfitItemResponse> getItems() { return items; }
    public void setItems(List<OutfitItemResponse> items) { this.items = items; }

    public List<String> getPaletteHarmonies() { return paletteHarmonies; }
    public void setPaletteHarmonies(List<String> paletteHarmonies) { this.paletteHarmonies = paletteHarmonies; }
}

