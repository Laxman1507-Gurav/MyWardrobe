package com.shopsphere.recommendation;

import com.shopsphere.entity.ClothingItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class ScoringStrategy {

    private final PaletteCompatibilityRules paletteRules;
    private final SeasonalRules seasonalRules;

    public ScoringStrategy(PaletteCompatibilityRules paletteRules, SeasonalRules seasonalRules) {
        this.paletteRules = paletteRules;
        this.seasonalRules = seasonalRules;
    }

    public static class ScoreResult {
        private int totalScore; // 0 - 100
        private String stylistNote;
        private List<String> harmonies = new ArrayList<>();

        public ScoreResult(int totalScore, String stylistNote, List<String> harmonies) {
            this.totalScore = totalScore;
            this.stylistNote = stylistNote;
            this.harmonies = harmonies;
        }

        public int getTotalScore() { return totalScore; }
        public String getStylistNote() { return stylistNote; }
        public List<String> getHarmonies() { return harmonies; }
    }

    public ScoreResult evaluateOutfit(List<ClothingItem> items, String targetOccasion, String targetSeason, String preferredColour) {
        if (items == null || items.isEmpty()) {
            return new ScoreResult(0, "Incomplete outfit combination.", List.of());
        }

        // 1. Availability validation (items must be AVAILABLE)
        boolean allAvailable = items.stream().allMatch(i -> "AVAILABLE".equalsIgnoreCase(i.getAvailabilityStatus()));
        if (!allAvailable) {
            return new ScoreResult(20, "One or more items are currently in laundry or unavailable.", List.of());
        }

        // 2. Palette Score (max 35)
        List<String> colors = items.stream().map(ClothingItem::getPrimaryColour).toList();
        List<String> harmonies = new ArrayList<>();
        int paletteScore = paletteRules.evaluatePaletteScore(colors, harmonies);

        // Preference color boost (+5)
        if (preferredColour != null && !preferredColour.isBlank()) {
            boolean hasPref = colors.stream().anyMatch(c -> c != null && c.equalsIgnoreCase(preferredColour.trim()));
            if (hasPref) {
                paletteScore = Math.min(35, paletteScore + 5);
                harmonies.add("Features your selected focus color: " + preferredColour);
            }
        }

        // 3. Season Score (max 25)
        int seasonSum = 0;
        for (ClothingItem item : items) {
            seasonSum += seasonalRules.evaluateSeasonScore(item.getSeason(), targetSeason);
        }
        int seasonScore = Math.round((float) seasonSum / items.size());

        // 4. Occasion & Style Score (max 25)
        int occasionMatches = 0;
        for (ClothingItem item : items) {
            Set<String> occasions = item.getOccasions();
            if (targetOccasion == null || targetOccasion.isBlank()) {
                occasionMatches++;
            } else if (occasions != null && occasions.stream().anyMatch(o -> o.equalsIgnoreCase(targetOccasion))) {
                occasionMatches += 2;
            } else if (item.getStyle() != null && item.getStyle().equalsIgnoreCase(targetOccasion)) {
                occasionMatches += 2;
            } else {
                occasionMatches++;
            }
        }
        int occasionScore = Math.min(25, Math.round(((float) occasionMatches / (items.size() * 2)) * 25));

        // 5. Wardrobe Cohesion / Favorites Boost (max 15)
        long favCount = items.stream().filter(ClothingItem::getIsFavourite).count();
        int cohesionScore = 10 + (favCount > 0 ? 5 : 0);

        int total = Math.min(100, paletteScore + seasonScore + occasionScore + cohesionScore);

        // Generate expressive stylist note
        StringBuilder noteBuilder = new StringBuilder();
        if (total >= 90) {
            noteBuilder.append("Superb pairing! ");
        } else if (total >= 75) {
            noteBuilder.append("Effortless look. ");
        } else {
            noteBuilder.append("Eclectic mix. ");
        }

        if (!harmonies.isEmpty()) {
            noteBuilder.append(harmonies.get(0)).append(". ");
        }
        if (targetOccasion != null && !targetOccasion.isBlank()) {
            noteBuilder.append("Tailored for ").append(targetOccasion.toLowerCase()).append(" dressing. ");
        }
        if (favCount > 0) {
            noteBuilder.append("Includes ").append(favCount).append(" of your staple favorite pieces.");
        }

        return new ScoreResult(total, noteBuilder.toString().trim(), harmonies);
    }
}

