package com.miraclear.viewing.controller;

import com.miraclear.viewing.dto.ModelDto;
import com.miraclear.viewing.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}