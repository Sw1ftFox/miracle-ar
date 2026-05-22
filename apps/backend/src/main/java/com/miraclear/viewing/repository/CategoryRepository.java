package com.miraclear.viewing.repository;

import com.miraclear.viewing.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
  boolean existsByName(String name);
}