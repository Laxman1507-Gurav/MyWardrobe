package com.shopsphere.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "wear_history")
public class WearHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "outfit_id")
    private Outfit outfit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clothing_item_id")
    private ClothingItem clothingItem;

    @Column(name = "worn_date", nullable = false)
    private LocalDate wornDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public WearHistory() {}

    public WearHistory(User user, Outfit outfit, ClothingItem clothingItem, LocalDate wornDate, String notes) {
        this.user = user;
        this.outfit = outfit;
        this.clothingItem = clothingItem;
        this.wornDate = wornDate;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Outfit getOutfit() { return outfit; }
    public void setOutfit(Outfit outfit) { this.outfit = outfit; }

    public ClothingItem getClothingItem() { return clothingItem; }
    public void setClothingItem(ClothingItem clothingItem) { this.clothingItem = clothingItem; }

    public LocalDate getWornDate() { return wornDate; }
    public void setWornDate(LocalDate wornDate) { this.wornDate = wornDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

