package com.shopsphere.repository;

import com.shopsphere.entity.WearHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WearHistoryRepository extends JpaRepository<WearHistory, Long> {

    List<WearHistory> findByUserIdOrderByWornDateDesc(Long userId);

    List<WearHistory> findByUserIdAndClothingItemId(Long userId, Long clothingItemId);

    long countByUserIdAndClothingItemId(Long userId, Long clothingItemId);

    long countByUserId(Long userId);

    @Query("SELECT wh.clothingItem.id, COUNT(wh) FROM WearHistory wh WHERE wh.user.id = :userId GROUP BY wh.clothingItem.id")
    List<Object[]> countWearsPerItem(@Param("userId") Long userId);

    @Query("SELECT wh.wornDate, COUNT(wh) FROM WearHistory wh WHERE wh.user.id = :userId AND wh.wornDate >= :since GROUP BY wh.wornDate ORDER BY wh.wornDate ASC")
    List<Object[]> countWearsByDate(@Param("userId") Long userId, @Param("since") LocalDate since);
}

