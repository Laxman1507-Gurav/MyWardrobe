package com.shopsphere.repository;

import com.shopsphere.entity.LaundryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaundryRepository extends JpaRepository<LaundryRecord, Long> {

    List<LaundryRecord> findByUserIdOrderByRecordedAtDesc(Long userId);

    List<LaundryRecord> findByUserIdAndStatus(Long userId, String status);

    List<LaundryRecord> findByUserIdAndClothingItemIdOrderByRecordedAtDesc(Long userId, Long clothingItemId);
}

