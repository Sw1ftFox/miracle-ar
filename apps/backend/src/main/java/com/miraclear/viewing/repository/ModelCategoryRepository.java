package com.miraclear.viewing.repository;

import com.miraclear.viewing.entity.ModelCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ModelCategoryRepository extends JpaRepository<ModelCategory, Long> {
    List<ModelCategory> findByModelFileName(String modelFileName);
    void deleteByModelFileName(String modelFileName);
    List<ModelCategory> findByCategoryId(Long categoryId);
}