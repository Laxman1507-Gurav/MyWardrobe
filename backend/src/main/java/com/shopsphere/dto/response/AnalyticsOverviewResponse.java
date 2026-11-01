package com.shopsphere.dto.response;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class AnalyticsOverviewResponse {

    private long totalClothingItems;
    private long totalOutfits;
    private BigDecimal totalWardrobeValue = BigDecimal.ZERO;
    private long itemsInLaundry;
    private long totalWearLogs;
    private double averageCostPerWear = 0.0;
    private List<CategoryCount> categoryBreakdown = new ArrayList<>();
    private List<ColorCount> colorBreakdown = new ArrayList<>();
    private List<CostPerWearItem> costPerWearItems = new ArrayList<>();

    public AnalyticsOverviewResponse() {}

    public static class CategoryCount {
        private String categoryName;
        private String categoryCode;
        private long count;

        public CategoryCount() {}
        public CategoryCount(String categoryName, String categoryCode, long count) {
            this.categoryName = categoryName;
            this.categoryCode = categoryCode;
            this.count = count;
        }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getCategoryCode() { return categoryCode; }
        public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class ColorCount {
        private String colour;
        private long count;

        public ColorCount() {}
        public ColorCount(String colour, long count) {
            this.colour = colour;
            this.count = count;
        }
        public String getColour() { return colour; }
        public void setColour(String colour) { this.colour = colour; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class CostPerWearItem {
        private Long id;
        private String name;
        private String imagePath;
        private String categoryName;
        private BigDecimal purchasePrice;
        private long wearCount;
        private double costPerWear;
        private String valueRating; // EXCELLENT_VALUE, GOOD_VALUE, UNDERUTILIZED

        public CostPerWearItem() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getImagePath() { return imagePath; }
        public void setImagePath(String imagePath) { this.imagePath = imagePath; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public BigDecimal getPurchasePrice() { return purchasePrice; }
        public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }
        public long getWearCount() { return wearCount; }
        public void setWearCount(long wearCount) { this.wearCount = wearCount; }
        public double getCostPerWear() { return costPerWear; }
        public void setCostPerWear(double costPerWear) { this.costPerWear = costPerWear; }
        public String getValueRating() { return valueRating; }
        public void setValueRating(String valueRating) { this.valueRating = valueRating; }
    }

    public long getTotalClothingItems() { return totalClothingItems; }
    public void setTotalClothingItems(long totalClothingItems) { this.totalClothingItems = totalClothingItems; }

    public long getTotalOutfits() { return totalOutfits; }
    public void setTotalOutfits(long totalOutfits) { this.totalOutfits = totalOutfits; }

    public BigDecimal getTotalWardrobeValue() { return totalWardrobeValue; }
    public void setTotalWardrobeValue(BigDecimal totalWardrobeValue) { this.totalWardrobeValue = totalWardrobeValue; }

    public long getItemsInLaundry() { return itemsInLaundry; }
    public void setItemsInLaundry(long itemsInLaundry) { this.itemsInLaundry = itemsInLaundry; }

    public long getTotalWearLogs() { return totalWearLogs; }
    public void setTotalWearLogs(long totalWearLogs) { this.totalWearLogs = totalWearLogs; }

    public double getAverageCostPerWear() { return averageCostPerWear; }
    public void setAverageCostPerWear(double averageCostPerWear) { this.averageCostPerWear = averageCostPerWear; }

    public List<CategoryCount> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryCount> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<ColorCount> getColorBreakdown() { return colorBreakdown; }
    public void setColorBreakdown(List<ColorCount> colorBreakdown) { this.colorBreakdown = colorBreakdown; }

    public List<CostPerWearItem> getCostPerWearItems() { return costPerWearItems; }
    public void setCostPerWearItems(List<CostPerWearItem> costPerWearItems) { this.costPerWearItems = costPerWearItems; }
}

