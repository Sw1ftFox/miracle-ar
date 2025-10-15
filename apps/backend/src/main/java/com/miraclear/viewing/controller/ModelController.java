package com.example.viewing.controller;

import com.example.viewing.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/models")
public class ModelController {

    private final StorageService storageService;

    public ModelController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping
    public List<String> listModels() throws IOException {
        return storageService.listModels();
    }

    @GetMapping("/sounds")
    public List<String> listSounds() throws IOException {
        return storageService.listSounds();
    }

    @GetMapping("/patterns")
    public List<String> listPatterns() throws IOException {
        return storageService.listPatterns();
    }

    @DeleteMapping("/sound/{fileName}")
    public ResponseEntity<String> deleteSound(@PathVariable String fileName) throws IOException {
        if (storageService.deleteSound(fileName)) {
            return ResponseEntity.ok("Sound deleted");
        }
        return ResponseEntity.badRequest().body("File not found");
    }

    @DeleteMapping("/pattern/{fileName}")
    public ResponseEntity<String> deletePattern(@PathVariable String fileName) throws IOException {
        if (storageService.deletePattern(fileName)) {
            return ResponseEntity.ok("Pattern deleted");
        }
        return ResponseEntity.badRequest().body("File not found");
    }

    @GetMapping("/current")
    public String getCurrentModel() {
        return storageService.getCurrentModel();
    }

    @GetMapping("/current-pattern")
    public String getCurrentPattern() {
        return storageService.getCurrentPattern();
    }

    @PostMapping("/set-current")
    public ResponseEntity<String> setCurrentModel(@RequestParam String model) {
        storageService.setCurrentModel(model);
        return ResponseEntity.ok("Model selected");
    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<String> deleteModel(@PathVariable String fileName) throws IOException {
        if (storageService.deleteModel(fileName)) {
            return ResponseEntity.ok("Model deleted");
        }
        return ResponseEntity.badRequest().body("File not found");
    }

    @GetMapping("/images")
    public List<String> listImages() throws IOException {
        return storageService.listImages();
    }

    @GetMapping("/descriptions")
    public List<String> listDescriptions() throws IOException {
        return storageService.listDescriptions();
    }

    @GetMapping("/description/{fileName}")
    public ResponseEntity<String> getDescription(@PathVariable String fileName) throws IOException {
        String content = storageService.getDescriptionContent(fileName);
        return ResponseEntity.ok(content);
    }

    @DeleteMapping("/image/{fileName}")
    public ResponseEntity<String> deleteImage(@PathVariable String fileName) throws IOException {
        if (storageService.deleteImage(fileName)) {
            return ResponseEntity.ok("Image deleted");
        }
        return ResponseEntity.badRequest().body("File not found");
    }

    @DeleteMapping("/description/{fileName}")
    public ResponseEntity<String> deleteDescription(@PathVariable String fileName) throws IOException {
        if (storageService.deleteDescription(fileName)) {
            return ResponseEntity.ok("Description deleted");
        }
        return ResponseEntity.badRequest().body("File not found");
    }
}