package com.shopsphere.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "preferred_styles", columnDefinition = "TEXT")
    private String preferredStyles = "Casual, Smart Casual, Minimalist";

    @Column(name = "preferred_colours", columnDefinition = "TEXT")
    private String preferredColours = "Black, White, Grey, Beige, Navy";

    @Column(name = "preferred_occasions", columnDefinition = "TEXT")
    private String preferredOccasions = "Everyday, Work, Dinner, Weekend";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserPreferences() {}

    public UserPreferences(User user) {
        this.user = user;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPreferredStyles() { return preferredStyles; }
    public void setPreferredStyles(String preferredStyles) { this.preferredStyles = preferredStyles; }

    public String getPreferredColours() { return preferredColours; }
    public void setPreferredColours(String preferredColours) { this.preferredColours = preferredColours; }

    public String getPreferredOccasions() { return preferredOccasions; }
    public void setPreferredOccasions(String preferredOccasions) { this.preferredOccasions = preferredOccasions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
