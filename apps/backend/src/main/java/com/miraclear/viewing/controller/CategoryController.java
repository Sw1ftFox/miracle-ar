package com.miraclear.viewing.controller;

import com.miraclear.viewing.entity.Category;
import com.miraclear.viewing.entity.ModelCategory;
import com.miraclear.viewing.repository.CategoryRepository;
import com.miraclear.viewing.repository.ModelCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ModelCategoryRepository modelCategoryRepository;

    private static final String DEFAULT_CATEGORY_NAME = "Другие";

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            return ResponseEntity.badRequest().body("Category already exists");
        }
        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Category categoryToDelete = categoryRepository.findById(id).orElse(null);
        if (categoryToDelete == null) {
            return ResponseEntity.notFound().build();
        }

        if (DEFAULT_CATEGORY_NAME.equals(categoryToDelete.getName())) {
            return ResponseEntity.badRequest().body("Нельзя удалить категорию «Другие»");
        }

        List<String> relatedModelNames = modelCategoryRepository.findByCategoryId(id)
                .stream()
                .map(ModelCategory::getModelFileName)
                .collect(Collectors.toList());

        modelCategoryRepository.deleteByCategoryId(id);

        Category defaultCategory = categoryRepository.findByName(DEFAULT_CATEGORY_NAME)
                .orElseGet(() -> {
                    Category newDefault = new Category();
                    newDefault.setName(DEFAULT_CATEGORY_NAME);
                    newDefault.setDescription("Модели без категории");
                    return categoryRepository.save(newDefault);
                });

        for (String modelName : relatedModelNames) {
            boolean hasOtherCategories = !modelCategoryRepository.findByModelFileName(modelName).isEmpty();
            if (!hasOtherCategories) {
                ModelCategory mc = new ModelCategory();
                mc.setModelFileName(modelName);
                mc.setCategory(defaultCategory);
                modelCategoryRepository.save(mc);
            }
        }

        categoryRepository.delete(categoryToDelete);
        return ResponseEntity.ok().build();
    }
}