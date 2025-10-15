package com.example.viewing.controller;

import com.example.viewing.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final StorageService storageService;

    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "model") String type) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Файл пуст");
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            return ResponseEntity.badRequest().body("Недопустимое имя файла");
        }

        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();

        if (type.equals("model") && !extension.equals(".glb")) {
            return ResponseEntity.badRequest().body("Для моделей разрешены только файлы GLB");
        } else if (type.equals("image") && !Arrays.asList(".png", ".jpg", ".jpeg").contains(extension)) {
            return ResponseEntity.badRequest().body("Для изображений разрешены только файлы PNG/JPG/JPEG");
        } else if (type.equals("description") && !extension.equals(".txt")) {
            return ResponseEntity.badRequest().body("Для описания разрешены только текстовые файлы TXT");
        } else if (type.equals("pattern") && !extension.equals(".patt")) {
            return ResponseEntity.badRequest().body("Для паттернов разрешены только файлы .patt");
        } else if (type.equals("sound") && !extension.equals(".mp3")) {
            return ResponseEntity.badRequest().body("Для звуков разрешены только файлы MP3");
        }

        try {
            storageService.saveFile(file, type);
            return ResponseEntity.ok("Файл успешно загружен!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Ошибка сохранения файла!!!");
        }
    }

    @GetMapping("/models/{fileName:.+}")
    public ResponseEntity<Resource> serveModelFile(@PathVariable String fileName) throws MalformedURLException {
        return serveFile(fileName, "model/gltf-binary");
    }

    @GetMapping("/sounds/{fileName:.+}")
    public ResponseEntity<Resource> serveSoundFile(@PathVariable String fileName) throws MalformedURLException {
        return serveFile(fileName, "audio/mpeg");
    }

    @GetMapping("/patterns/{fileName:.+}")
    public ResponseEntity<Resource> servePatternFile(@PathVariable String fileName) throws MalformedURLException {
        return serveFile(fileName, "application/octet-stream");
    }

    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> serveImageFile(@PathVariable String fileName) throws MalformedURLException {
        String extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
        String contentType = "image/";

        switch (extension) {
            case ".png": contentType += "png"; break;
            case ".jpg": contentType += "jpeg"; break;
            case ".jpeg": contentType += "jpeg"; break;
            default: contentType = "application/octet-stream";
        }

        return serveFile(fileName, contentType);
    }

    @GetMapping("/descriptions/{fileName:.+}")
    public ResponseEntity<Resource> serveDescriptionFile(@PathVariable String fileName) throws MalformedURLException {
        return serveFile(fileName, "text/plain");
    }

    private ResponseEntity<Resource> serveFile(String fileName, String contentType) throws MalformedURLException {
        String storagePath = storageService.getStorageLocation();
        Path filePath = Paths.get(storagePath).resolve(fileName);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}