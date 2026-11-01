package com.shopsphere.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "outfit_items")
public class OutfitItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "outfit_id", nullable = false)
    private Outfit outfit;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "clothing_item_id", nullable = false)
    private ClothingItem clothingItem;

    @Column(name = "outfit_slot", nullable = false, length = 50)
    private String outfitSlot; // TOP, BOTTOM, OUTERWEAR, FOOTWEAR, ACCESSORY

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public OutfitItem() {}

    public OutfitItem(Outfit outfit, ClothingItem clothingItem, String outfitSlot, Integer displayOrder) {
        this.outfit = outfit;
        this.clothingItem = clothingItem;
        this.outfitSlot = outfitSlot;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Outfit getOutfit() { return outfit; }
    public void setOutfit(Outfit outfit) { this.outfit = outfit; }

    public ClothingItem getClothingItem() { return clothingItem; }
    public void setClothingItem(ClothingItem clothingItem) { this.clothingItem = clothingItem; }

    public String getOutfitSlot() { return outfitSlot; }
    public void setOutfitSlot(String outfitSlot) { this.outfitSlot = outfitSlot; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}

