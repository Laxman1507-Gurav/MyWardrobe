package com.shopsphere.dto.response;

public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String avatarUrl;
    private String preferredStyles;
    private String preferredColours;
    private String preferredOccasions;

    public UserResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getPreferredStyles() { return preferredStyles; }
    public void setPreferredStyles(String preferredStyles) { this.preferredStyles = preferredStyles; }

    public String getPreferredColours() { return preferredColours; }
    public void setPreferredColours(String preferredColours) { this.preferredColours = preferredColours; }

    public String getPreferredOccasions() { return preferredOccasions; }
    public void setPreferredOccasions(String preferredOccasions) { this.preferredOccasions = preferredOccasions; }
}
