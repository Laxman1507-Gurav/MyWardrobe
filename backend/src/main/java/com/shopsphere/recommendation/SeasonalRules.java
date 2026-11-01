package com.shopsphere.recommendation;

import org.springframework.stereotype.Component;

@Component
public class SeasonalRules {

    public int evaluateSeasonScore(String itemSeason, String targetSeason) {
        if (targetSeason == null || targetSeason.equalsIgnoreCase("ALL_SEASON")) {
            return 25;
        }

        if (itemSeason == null || itemSeason.equalsIgnoreCase("ALL_SEASON")) {
            return 22;
        }

        if (itemSeason.equalsIgnoreCase(targetSeason)) {
            return 25;
        }

        // Near-season transitions
        if ((targetSeason.equalsIgnoreCase("SPRING") && itemSeason.equalsIgnoreCase("SUMMER")) ||
            (targetSeason.equalsIgnoreCase("AUTUMN") && itemSeason.equalsIgnoreCase("WINTER")) ||
            (targetSeason.equalsIgnoreCase("SPRING") && itemSeason.equalsIgnoreCase("AUTUMN"))) {
            return 18;
        }

        return 10;
    }
}

