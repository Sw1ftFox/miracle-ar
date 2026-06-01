package com.miraclear.viewing.controller;

import com.miraclear.viewing.dto.ModelResponseDto;
import com.miraclear.viewing.entity.Model;
import com.miraclear.viewing.repository.ModelRepository;
import com.miraclear.viewing.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/models")
public class AdminModelController {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private StorageService storageService;

    private ModelResponseDto convertToDto(Model model) {
        ModelResponseDto dto = new ModelResponseDto();
        dto.setId(model.getId());
        dto.setFileName(model.getFileName());
        dto.setDisplayName(model.getDisplayName());
        dto.setDescription(model.getDescription());
        dto.setPreviewUrl(model.getPreviewUrl());
        dto.setPatternUrl(model.getPatternUrl());
        dto.setSoundUrl(model.getSoundUrl());
        dto.setVideoUrl(model.getVideoUrl());
        dto.setCreatedAt(model.getCreatedAt());
        dto.setUpdatedAt(model.getUpdatedAt());
        return dto;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ModelResponseDto> getAllModels() {
        return modelRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ModelResponseDto> getModel(@PathVariable Long id) {
        return modelRepository.findById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ModelResponseDto createModel(@RequestBody Model model) {
        Model saved = modelRepository.save(model);
        return convertToDto(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<ModelResponseDto> updateModel(@PathVariable Long id, @RequestBody Model model) {
        if (!modelRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        model.setId(id);
        Model updated = modelRepository.save(model);
        return ResponseEntity.ok(convertToDto(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> deleteModel(@PathVariable Long id) {
        try {
            Model model = modelRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));
            storageService.deleteModelAndRelatedFiles(model.getFileName());
            modelRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Ошибка при удалении файлов: " + e.getMessage());
        }
    }
}