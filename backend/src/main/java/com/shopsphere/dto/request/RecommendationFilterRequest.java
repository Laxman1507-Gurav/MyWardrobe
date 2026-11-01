package com.shopsphere.dto.request;

public class RecommendationFilterRequest {

    private String occasion;
    private String season;
    private String style;
    private String preferredColour;

    public RecommendationFilterRequest() {}

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getPreferredColour() { return preferredColour; }
    public void setPreferredColour(String preferredColour) { this.preferredColour = preferredColour; }
}

