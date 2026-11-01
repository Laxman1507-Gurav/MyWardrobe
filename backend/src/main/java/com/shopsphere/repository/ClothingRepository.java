package com.shopsphere.repository;

import com.shopsphere.entity.ClothingItem;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClothingRepository extends JpaRepository<ClothingItem, Long> {

    List<ClothingItem> findByUserId(Long userId, Sort sort);

    Optional<ClothingItem> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT c FROM ClothingItem c WHERE c.user.id = :userId " +
           "AND (:categoryId IS NULL OR c.category.id = :categoryId) " +
           "AND (:availability IS NULL OR c.availabilityStatus = :availability) " +
           "AND (:isFavourite IS NULL OR c.isFavourite = :isFavourite) " +
           "AND (:season IS NULL OR c.season = :season OR c.season = 'ALL_SEASON') " +
           "AND (:style IS NULL OR c.style = :style) " +
           "AND (:query IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<ClothingItem> searchItems(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("availability") String availability,
            @Param("isFavourite") Boolean isFavourite,
            @Param("season") String season,
            @Param("style") String style,
            @Param("query") String query,
            Sort sort
    );

    long countByUserId(Long userId);
    long countByUserIdAndIsFavouriteTrue(Long userId);
    long countByUserIdAndAvailabilityStatus(Long userId, String availabilityStatus);
}
