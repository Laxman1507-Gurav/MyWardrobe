package com.shopsphere.service;

import com.shopsphere.dto.response.AnalyticsOverviewResponse;
import com.shopsphere.entity.ClothingItem;
import com.shopsphere.repository.ClothingRepository;
import com.shopsphere.repository.OutfitRepository;
import com.shopsphere.repository.WearHistoryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class AnalyticsService {

    private final ClothingRepository clothingRepository;
    private final OutfitRepository outfitRepository;
    private final WearHistoryRepository wearHistoryRepository;

    public AnalyticsService(ClothingRepository clothingRepository,
                            OutfitRepository outfitRepository,
                            WearHistoryRepository wearHistoryRepository) {
        this.clothingRepository = clothingRepository;
        this.outfitRepository = outfitRepository;
        this.wearHistoryRepository = wearHistoryRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsOverviewResponse getOverview(Long userId) {
        List<ClothingItem> items = clothingRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "createdAt"));
        long totalOutfits = outfitRepository.countByUserId(userId);
        long totalWearLogs = wearHistoryRepository.countByUserId(userId);

        AnalyticsOverviewResponse res = new AnalyticsOverviewResponse();
        res.setTotalClothingItems(items.size());
        res.setTotalOutfits(totalOutfits);
        res.setTotalWearLogs(totalWearLogs);

        BigDecimal totalValuation = BigDecimal.ZERO;
        long inLaundryCount = 0;

        Map<String, Long> categoryCounts = new HashMap<>();
        Map<String, String> categoryCodes = new HashMap<>();
        Map<String, Long> colorCounts = new HashMap<>();

        // Query wear counts per item
        List<Object[]> rawWears = wearHistoryRepository.countWearsPerItem(userId);
        Map<Long, Long> wearMap = new HashMap<>();
        for (Object[] row : rawWears) {
            if (row[0] != null && row[1] != null) {
                wearMap.put((Long) row[0], ((Number) row[1]).longValue());
            }
        }

        List<AnalyticsOverviewResponse.CostPerWearItem> cpwList = new ArrayList<>();
        double sumCpw = 0;
        int cpwItemCount = 0;

        for (ClothingItem item : items) {
            if (item.getPurchasePrice() != null) {
                totalValuation = totalValuation.add(item.getPurchasePrice());
            }

            if ("IN_LAUNDRY".equalsIgnoreCase(item.getAvailabilityStatus())) {
                inLaundryCount++;
            }

            // Category breakdown
            if (item.getCategory() != null) {
                String catName = item.getCategory().getName();
                String catCode = item.getCategory().getCode();
                categoryCounts.put(catName, categoryCounts.getOrDefault(catName, 0L) + 1);
                categoryCodes.put(catName, catCode);
            }

            // Color breakdown
            if (item.getPrimaryColour() != null && !item.getPrimaryColour().isBlank()) {
                String col = item.getPrimaryColour().trim();
                colorCounts.put(col, colorCounts.getOrDefault(col, 0L) + 1);
            }

            // Cost per wear
            long wears = wearMap.getOrDefault(item.getId(), 0L);
            double price = item.getPurchasePrice() != null ? item.getPurchasePrice().doubleValue() : 0.0;
            double cpw = (wears > 0) ? (price / wears) : price;

            String rating = "UNDERUTILIZED";
            if (wears >= 8 || (wears >= 3 && cpw <= 20.0)) {
                rating = "EXCELLENT_VALUE";
            } else if (wears >= 2) {
                rating = "GOOD_VALUE";
            }

            AnalyticsOverviewResponse.CostPerWearItem cpwItem = new AnalyticsOverviewResponse.CostPerWearItem();
            cpwItem.setId(item.getId());
            cpwItem.setName(item.getName());
            cpwItem.setImagePath(item.getImagePath());
            cpwItem.setCategoryName(item.getCategory() != null ? item.getCategory().getName() : "");
            cpwItem.setPurchasePrice(item.getPurchasePrice() != null ? item.getPurchasePrice() : BigDecimal.ZERO);
            cpwItem.setWearCount(wears);
            cpwItem.setCostPerWear(Math.round(cpw * 100.0) / 100.0);
            cpwItem.setValueRating(rating);
            cpwList.add(cpwItem);

            if (price > 0) {
                sumCpw += cpw;
                cpwItemCount++;
            }
        }

        res.setTotalWardrobeValue(totalValuation.setScale(2, RoundingMode.HALF_UP));
        res.setItemsInLaundry(inLaundryCount);
        res.setAverageCostPerWear(cpwItemCount > 0 ? Math.round((sumCpw / cpwItemCount) * 100.0) / 100.0 : 0.0);

        // Convert maps to lists
        List<AnalyticsOverviewResponse.CategoryCount> catList = new ArrayList<>();
        categoryCounts.forEach((name, count) -> {
            catList.add(new AnalyticsOverviewResponse.CategoryCount(name, categoryCodes.get(name), count));
        });
        catList.sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
        res.setCategoryBreakdown(catList);

        List<AnalyticsOverviewResponse.ColorCount> colList = new ArrayList<>();
        colorCounts.forEach((col, count) -> {
            colList.add(new AnalyticsOverviewResponse.ColorCount(col, count));
        });
        colList.sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
        res.setColorBreakdown(colList);

        // Sort CPW items by wear count desc, then price desc
        cpwList.sort((a, b) -> Long.compare(b.getWearCount(), a.getWearCount()));
        res.setCostPerWearItems(cpwList);

        return res;
    }
}

