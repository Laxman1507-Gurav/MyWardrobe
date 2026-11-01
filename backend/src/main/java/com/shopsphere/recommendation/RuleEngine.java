package com.shopsphere.recommendation;

import com.shopsphere.dto.response.OutfitItemResponse;
import com.shopsphere.dto.response.RecommendationResponse;
import com.shopsphere.entity.ClothingItem;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class RuleEngine {

    private final ScoringStrategy scoringStrategy;

    public RuleEngine(ScoringStrategy scoringStrategy) {
        this.scoringStrategy = scoringStrategy;
    }

    public List<RecommendationResponse> generateRecommendations(
            List<ClothingItem> allItems,
            String targetOccasion,
            String targetSeason,
            String preferredColour,
            int limit) {

        // Filter only available items
        List<ClothingItem> available = allItems.stream()
                .filter(i -> "AVAILABLE".equalsIgnoreCase(i.getAvailabilityStatus()))
                .toList();

        if (available.isEmpty()) {
            return Collections.emptyList();
        }

        // Categorize into slots
        List<ClothingItem> tops = new ArrayList<>();
        List<ClothingItem> bottoms = new ArrayList<>();
        List<ClothingItem> outerwear = new ArrayList<>();
        List<ClothingItem> footwear = new ArrayList<>();
        List<ClothingItem> accessories = new ArrayList<>();

        for (ClothingItem item : available) {
            String code = item.getCategory() != null ? item.getCategory().getCode() : "";
            if (code == null) code = "";
            code = code.toUpperCase();

            if (code.equals("TSHIRTS") || code.equals("SHIRTS") || code.equals("TOPS") || code.equals("ETHNIC")) {
                tops.add(item);
            } else if (code.equals("JEANS") || code.equals("TROUSERS") || code.equals("SHORTS") || code.equals("SKIRTS")) {
                bottoms.add(item);
            } else if (code.equals("JACKETS") || code.equals("HOODIES") || code.equals("FORMAL")) {
                outerwear.add(item);
            } else if (code.equals("SHOES")) {
                footwear.add(item);
            } else {
                accessories.add(item);
            }
        }

        // Fallbacks if top or bottom bucket is empty
        if (tops.isEmpty() && !available.isEmpty()) {
            tops.add(available.get(0));
        }
        if (bottoms.isEmpty() && available.size() > 1) {
            bottoms.add(available.get(1));
        }

        List<RecommendationResponse> candidates = new ArrayList<>();
        int comboCount = 0;

        // Compose combinations
        for (ClothingItem top : tops) {
            for (ClothingItem bottom : bottoms) {
                if (top.getId().equals(bottom.getId())) continue;

                List<ClothingItem> outfitItems = new ArrayList<>();
                List<OutfitItemResponse> itemResponses = new ArrayList<>();

                outfitItems.add(top);
                itemResponses.add(toItemResponse(top, "TOP", 1));

                outfitItems.add(bottom);
                itemResponses.add(toItemResponse(bottom, "BOTTOM", 2));

                // Optional Outerwear (if cold or formal occasion)
                if (!outerwear.isEmpty() && comboCount % 2 == 0) {
                    ClothingItem outItem = outerwear.get(comboCount % outerwear.size());
                    outfitItems.add(outItem);
                    itemResponses.add(toItemResponse(outItem, "OUTERWEAR", 3));
                }

                // Optional Footwear
                if (!footwear.isEmpty()) {
                    ClothingItem shoe = footwear.get(comboCount % footwear.size());
                    outfitItems.add(shoe);
                    itemResponses.add(toItemResponse(shoe, "FOOTWEAR", 4));
                }

                // Optional Accessory
                if (!accessories.isEmpty() && comboCount % 3 == 0) {
                    ClothingItem acc = accessories.get(comboCount % accessories.size());
                    outfitItems.add(acc);
                    itemResponses.add(toItemResponse(acc, "ACCESSORY", 5));
                }

                ScoringStrategy.ScoreResult scoreRes = scoringStrategy.evaluateOutfit(
                        outfitItems, targetOccasion, targetSeason, preferredColour
                );

                RecommendationResponse rec = new RecommendationResponse();
                rec.setName(generateOutfitName(top, bottom, targetOccasion));
                rec.setOccasion(targetOccasion != null && !targetOccasion.isBlank() ? targetOccasion : "Everyday");
                rec.setSeason(targetSeason != null && !targetSeason.isBlank() ? targetSeason : "ALL_SEASON");
                rec.setStyle(top.getStyle() != null ? top.getStyle() : "CASUAL");
                rec.setCompatibilityScore(scoreRes.getTotalScore());
                rec.setStylistNotes(scoreRes.getStylistNote());
                rec.setItems(itemResponses);
                rec.setPaletteHarmonies(scoreRes.getHarmonies());

                candidates.add(rec);
                comboCount++;

                if (comboCount > 50) break; // prevent combinatorial explosion
            }
            if (comboCount > 50) break;
        }

        // Sort descending by compatibility score
        candidates.sort(Comparator.comparingInt(RecommendationResponse::getCompatibilityScore).reversed());

        return candidates.stream().limit(limit).toList();
    }

    private String generateOutfitName(ClothingItem top, ClothingItem bottom, String occasion) {
        String occasionPrefix = occasion != null && !occasion.isBlank() ? occasion + " " : "";
        return occasionPrefix + top.getPrimaryColour() + " " + top.getName() + " & " + bottom.getName();
    }

    private OutfitItemResponse toItemResponse(ClothingItem item, String slot, int order) {
        OutfitItemResponse res = new OutfitItemResponse();
        res.setClothingItemId(item.getId());
        res.setClothingItemName(item.getName());
        res.setClothingItemImage(item.getImagePath());
        res.setPrimaryColour(item.getPrimaryColour());
        res.setBrand(item.getBrand());
        res.setCategoryName(item.getCategory() != null ? item.getCategory().getName() : "");
        res.setCategoryCode(item.getCategory() != null ? item.getCategory().getCode() : "");
        res.setOutfitSlot(slot);
        res.setDisplayOrder(order);
        return res;
    }
}

