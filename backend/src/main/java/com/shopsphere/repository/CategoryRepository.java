package com.shopsphere.repository;

import com.shopsphere.entity.ClothingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<ClothingCategory, Long> {
    Optional<ClothingCategory> findByCode(String code);
    List<ClothingCategory> findAllByOrderByDisplayOrderAsc();
}
