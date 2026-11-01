package com.shopsphere.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "outfits")
public class Outfit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String occasion;

    @Column(length = 50)
    private String season = "ALL_SEASON";

    @Column(length = 50)
    private String style = "CASUAL";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_favourite", nullable = false)
    private Boolean isFavourite = false;

    @OneToMany(mappedBy = "outfit", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    private List<OutfitItem> items = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Outfit() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addItem(OutfitItem item) {
        items.add(item);
        item.setOutfit(this);
    }

    public void removeItem(OutfitItem item) {
        items.remove(item);
        item.setOutfit(null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public List<OutfitItem> getItems() { return items; }
    public void setItems(List<OutfitItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

