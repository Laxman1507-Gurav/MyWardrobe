package com.shopsphere.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clothing_categories")
public class ClothingCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(columnDefinition = "TEXT")
    private String description;

    public ClothingCategory() {}

    public ClothingCategory(String name, String code, Integer displayOrder, String description) {
        this.name = name;
        this.code = code;
        this.displayOrder = displayOrder;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
