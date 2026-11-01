package com.shopsphere.service;

import com.shopsphere.dto.request.RecommendationFilterRequest;
import com.shopsphere.dto.response.RecommendationResponse;
import com.shopsphere.entity.ClothingItem;
import com.shopsphere.entity.UserPreferences;
import com.shopsphere.recommendation.RuleEngine;
import com.shopsphere.repository.ClothingRepository;
import com.shopsphere.repository.UserPreferencesRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService {

    private final ClothingRepository clothingRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final RuleEngine ruleEngine;

    public RecommendationService(ClothingRepository clothingRepository,
                                 UserPreferencesRepository userPreferencesRepository,
                                 RuleEngine ruleEngine) {
        this.clothingRepository = clothingRepository;
        this.userPreferencesRepository = userPreferencesRepository;
        this.ruleEngine = ruleEngine;
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> generateRecommendations(Long userId, RecommendationFilterRequest filter) {
        List<ClothingItem> userItems = clothingRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "createdAt"));

        String occasion = filter != null ? filter.getOccasion() : null;
        String season = filter != null ? filter.getSeason() : null;
        String preferredColour = filter != null ? filter.getPreferredColour() : null;

        // If no preferred color is specified, try reading from user preferences
        if ((preferredColour == null || preferredColour.isBlank())) {
            Optional<UserPreferences> prefOpt = userPreferencesRepository.findByUserId(userId);
            if (prefOpt.isPresent() && prefOpt.get().getPreferredColours() != null) {
                String[] colors = prefOpt.get().getPreferredColours().split(",");
                if (colors.length > 0) {
                    preferredColour = colors[0].trim();
                }
            }
        }

        return ruleEngine.generateRecommendations(userItems, occasion, season, preferredColour, 10);
    }
}

