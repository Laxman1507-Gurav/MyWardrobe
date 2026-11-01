package com.shopsphere.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "clothing_items")
public class ClothingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ClothingCategory category;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "image_path", nullable = false, length = 500)
    private String imagePath;

    @Column(name = "primary_colour", nullable = false, length = 50)
    private String primaryColour;

    @Column(name = "secondary_colour", length = 50)
    private String secondaryColour;

    @Column(length = 50)
    private String pattern;

    @Column(length = 100)
    private String brand;

    @Column(length = 100)
    private String fabric;

    @Column(length = 50)
    private String season = "ALL_SEASON"; // SPRING, SUMMER, AUTUMN, WINTER, ALL_SEASON

    @Column(length = 50)
    private String style = "CASUAL"; // CASUAL, FORMAL, SMART_CASUAL, ETHNIC, SPORTY, STREETWEAR

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "purchase_price", precision = 10, scale = 2)
    private BigDecimal purchasePrice = BigDecimal.ZERO;

    @Column(name = "availability_status", nullable = false, length = 50)
    private String availabilityStatus = "AVAILABLE"; // AVAILABLE, IN_LAUNDRY, UNAVAILABLE

    @Column(name = "is_favourite", nullable = false)
    private Boolean isFavourite = false;

    @Column(name = "washing_instructions", columnDefinition = "TEXT")
    private String washingInstructions;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "clothing_item_occasions", joinColumns = @JoinColumn(name = "clothing_item_id"))
    @Column(name = "occasion")
    private Set<String> occasions = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ClothingItem() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ClothingCategory getCategory() { return category; }
    public void setCategory(ClothingCategory category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getPrimaryColour() { return primaryColour; }
    public void setPrimaryColour(String primaryColour) { this.primaryColour = primaryColour; }

    public String getSecondaryColour() { return secondaryColour; }
    public void setSecondaryColour(String secondaryColour) { this.secondaryColour = secondaryColour; }

    public String getPattern() { return pattern; }
    public void setPattern(String pattern) { this.pattern = pattern; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getFabric() { return fabric; }
    public void setFabric(String fabric) { this.fabric = fabric; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public Boolean getIsFavourite() { return isFavourite; }
    public void setIsFavourite(Boolean favourite) { isFavourite = favourite; }

    public String getWashingInstructions() { return washingInstructions; }
    public void setWashingInstructions(String washingInstructions) { this.washingInstructions = washingInstructions; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Set<String> getOccasions() { return occasions; }
    public void setOccasions(Set<String> occasions) { this.occasions = occasions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
