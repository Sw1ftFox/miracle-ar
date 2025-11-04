package com.miraclear.viewing.controller;

import com.miraclear.viewing.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final StorageService storageService;

    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam("modelName") String modelName) {

        try {
            String result = storageService.saveFileWithModelAssociation(file, type, modelName);
            return ResponseEntity.ok(Map.of("message", result));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Ошибка при загрузке файла: " + e.getMessage()));
        }
    }

    @GetMapping("/models/{fileName:.+}")
    public ResponseEntity<Resource> serveModelFile(@PathVariable String fileName) {
        return storageService.serveFile(fileName, "models", "model/gltf-binary");
    }

    @GetMapping("/sounds/{fileName:.+}")
    public ResponseEntity<Resource> serveSoundFile(@PathVariable String fileName) {
        return storageService.serveFile(fileName, "sounds", "audio/mpeg");
    }

    @GetMapping("/patterns/{fileName:.+}")
    public ResponseEntity<Resource> servePatternFile(@PathVariable String fileName) {
        return storageService.serveFile(fileName, "patterns", "application/octet-stream");
    }

    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> serveImageFile(@PathVariable String fileName) {
        return storageService.serveImageFile(fileName);
    }
}