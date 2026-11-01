package com.shopsphere.recommendation;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PaletteCompatibilityRules {

    private static final Set<String> NEUTRALS = new HashSet<>(Arrays.asList(
            "black", "white", "grey", "gray", "beige", "navy", "cream", "tan", "brown", "khaki", "ivory"
    ));

    private static final Map<String, List<String>> HARMONY_PAIRS = new HashMap<>();

    static {
        HARMONY_PAIRS.put("blue", Arrays.asList("beige", "white", "grey", "brown", "tan", "cream"));
        HARMONY_PAIRS.put("navy", Arrays.asList("white", "beige", "grey", "khaki", "cream", "burgundy", "tan"));
        HARMONY_PAIRS.put("green", Arrays.asList("beige", "white", "black", "khaki", "brown", "cream"));
        HARMONY_PAIRS.put("olive", Arrays.asList("black", "white", "cream", "tan", "grey"));
        HARMONY_PAIRS.put("red", Arrays.asList("black", "white", "navy", "grey"));
        HARMONY_PAIRS.put("burgundy", Arrays.asList("black", "grey", "navy", "white", "cream"));
        HARMONY_PAIRS.put("pink", Arrays.asList("white", "grey", "navy", "denim", "beige"));
        HARMONY_PAIRS.put("yellow", Arrays.asList("navy", "white", "grey", "black"));
        HARMONY_PAIRS.put("denim", Arrays.asList("white", "black", "grey", "navy", "beige", "olive"));
    }

    public int evaluatePaletteScore(List<String> colours, List<String> harmoniesOut) {
        if (colours == null || colours.isEmpty()) {
            return 20;
        }

        List<String> cleanColours = colours.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .map(String::toLowerCase)
                .toList();

        if (cleanColours.isEmpty()) return 20;

        // Monochromatic check (all shades of same color or neutrals)
        boolean allNeutrals = cleanColours.stream().allMatch(NEUTRALS::contains);
        if (allNeutrals) {
            harmoniesOut.add("Clean minimalist neutral harmony (" + String.join(", ", cleanColours) + ")");
            return 35;
        }

        // Pairwise harmony
        int harmonyMatches = 0;
        for (int i = 0; i < cleanColours.size(); i++) {
            for (int j = i + 1; j < cleanColours.size(); j++) {
                String c1 = cleanColours.get(i);
                String c2 = cleanColours.get(j);

                if (c1.equalsIgnoreCase(c2)) {
                    harmonyMatches++;
                } else if (NEUTRALS.contains(c1) || NEUTRALS.contains(c2)) {
                    harmonyMatches++;
                } else if (HARMONY_PAIRS.containsKey(c1) && HARMONY_PAIRS.get(c1).contains(c2)) {
                    harmonyMatches += 2;
                    harmoniesOut.add("Complementary color pairing: " + c1 + " & " + c2);
                } else if (HARMONY_PAIRS.containsKey(c2) && HARMONY_PAIRS.get(c2).contains(c1)) {
                    harmonyMatches += 2;
                    harmoniesOut.add("Complementary color pairing: " + c2 + " & " + c1);
                }
            }
        }

        int score = Math.min(35, 15 + (harmonyMatches * 5));
        if (harmoniesOut.isEmpty()) {
            harmoniesOut.add("Balanced color palette: " + String.join(", ", cleanColours));
        }
        return score;
    }
}

