package com.shopsphere.dto.request;

public class UserPreferencesRequest {
    private String preferredStyles;
    private String preferredColours;
    private String preferredOccasions;

    public UserPreferencesRequest() {}

    public String getPreferredStyles() { return preferredStyles; }
    public void setPreferredStyles(String preferredStyles) { this.preferredStyles = preferredStyles; }

    public String getPreferredColours() { return preferredColours; }
    public void setPreferredColours(String preferredColours) { this.preferredColours = preferredColours; }

    public String getPreferredOccasions() { return preferredOccasions; }
    public void setPreferredOccasions(String preferredOccasions) { this.preferredOccasions = preferredOccasions; }
}
