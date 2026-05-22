package com.miraclear.viewing.controller;

import com.miraclear.viewing.dto.ModelDto;
import com.miraclear.viewing.entity.ModelCategory;
import com.miraclear.viewing.repository.CategoryRepository;
import com.miraclear.viewing.repository.ModelCategoryRepository;
import com.miraclear.viewing.service.StorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import com.miraclear.viewing.entity.Category;

@RestController
@RequestMapping("/api/models")
public class ModelController {

    private final StorageService storageService;

    public ModelController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/full")
    public ResponseEntity<List<ModelDto.FullInfo>> getAllModelsWithFullInfo() {
        try {
            List<ModelDto.FullInfo> models = storageService.getAllModelsWithFullInfo();
            return ResponseEntity.ok(models);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{name}/info")
    public ResponseEntity<ModelDto.DetailInfo> getModelInfo(@PathVariable String name) {
        try {
            ModelDto.DetailInfo modelInfo = storageService.getModelDetailInfo(name);
            if (modelInfo != null) {
                return ResponseEntity.ok(modelInfo);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<?> deleteModel(@PathVariable String name) {
        try {
            boolean deleted = storageService.deleteModelAndRelatedFiles(name);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Ошибка при удалении модели: " + e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<List<String>> getAllModelFiles() {
        try {
            List<String> models = storageService.getModelFiles();

            return ResponseEntity.ok(models);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/sounds")
    public ResponseEntity<List<String>> getAllSoundFiles() {
        try {
            List<String> sounds = storageService.getSoundFiles();
            return ResponseEntity.ok(sounds);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/patterns")
    public ResponseEntity<List<String>> getAllPatternFiles() {
        try {
            List<String> patterns = storageService.getPatternFiles();
            return ResponseEntity.ok(patterns);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/previews")
    public ResponseEntity<List<String>> getAllImageFiles() {
        try {
            List<String> previews = storageService.getImageFiles();
            return ResponseEntity.ok(previews);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/descriptions")
    public ResponseEntity<List<String>> getAllDescriptionFiles() {
        try {
            List<String> descriptions = storageService.getDescriptionFiles();
            return ResponseEntity.ok(descriptions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/videos")
    public ResponseEntity<List<String>> getAllVideoFiles() {
        try {
            List<String> videos = storageService.getVideoFiles();
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @Autowired private ModelCategoryRepository modelCategoryRepository;
    @Autowired private CategoryRepository categoryRepository;

    @PostMapping("/{modelName}/categories")
    public ResponseEntity<?> assignCategoriesToModel(@PathVariable String modelName,
                                                    @RequestBody List<Long> categoryIds) {
        modelCategoryRepository.deleteByModelFileName(modelName);
        for (Long catId : categoryIds) {
            Category cat = categoryRepository.findById(catId).orElseThrow();
            ModelCategory mc = new ModelCategory(modelName, cat);
            modelCategoryRepository.save(mc);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/categories/{id}/models")
    public List<String> getModelsByCategory(@PathVariable Long id) {
        return modelCategoryRepository.findByCategoryId(id).stream()
                .map(ModelCategory::getModelFileName)
                .collect(Collectors.toList());
    }
}