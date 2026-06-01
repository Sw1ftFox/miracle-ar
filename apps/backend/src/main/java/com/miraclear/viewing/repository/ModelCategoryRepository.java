package com.miraclear.viewing.repository;

import com.miraclear.viewing.entity.ModelCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ModelCategoryRepository extends JpaRepository<ModelCategory, Long> {
    List<ModelCategory> findByModelFileName(String modelFileName);
    @Modifying
    @Transactional
    void deleteByModelFileName(String modelFileName);
    List<ModelCategory> findByCategoryId(Long categoryId);
}