package com.shopsphere.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

public class ClothingItemResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryCode;
    private String name;
    private String imagePath;
    private String primaryColour;
    private String secondaryColour;
    private String pattern;
    private String brand;
    private String fabric;
    private String season;
    private String style;
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    private String availabilityStatus;
    private Boolean isFavourite;
    private String washingInstructions;
    private String notes;
    private Set<String> occasions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ClothingItemResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryCode() { return categoryCode; }
    public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }

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
