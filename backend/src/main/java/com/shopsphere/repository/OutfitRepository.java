package com.shopsphere.repository;

import com.shopsphere.entity.Outfit;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutfitRepository extends JpaRepository<Outfit, Long> {

    List<Outfit> findByUserId(Long userId, Sort sort);

    Optional<Outfit> findByIdAndUserId(Long id, Long userId);

    List<Outfit> findByUserIdAndIsFavouriteTrue(Long userId);

    @Query("SELECT o FROM Outfit o WHERE o.user.id = :userId " +
           "AND (:occasion IS NULL OR LOWER(o.occasion) = LOWER(:occasion)) " +
           "AND (:season IS NULL OR o.season = :season OR o.season = 'ALL_SEASON') " +
           "AND (:query IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Outfit> searchOutfits(@Param("userId") Long userId,
                               @Param("occasion") String occasion,
                               @Param("season") String season,
                               @Param("query") String query,
                               Sort sort);

    long countByUserId(Long userId);
}

