package com.shopsphere.repository;

import com.shopsphere.entity.OutfitItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutfitItemRepository extends JpaRepository<OutfitItem, Long> {
    List<OutfitItem> findByOutfitId(Long outfitId);
    void deleteByOutfitId(Long outfitId);
}

