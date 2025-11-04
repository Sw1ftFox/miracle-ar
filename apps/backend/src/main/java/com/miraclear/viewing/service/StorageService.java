package com.miraclear.viewing.service;

import com.miraclear.viewing.dto.ModelDto;
import com.miraclear.viewing.dto.AppConfigDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StorageService {

    @Value("${storage.location}")
    private String storageLocation;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${current.model:}")
    private String currentModel;

    @Value("${app.version:1.0.0}")
    private String appVersion;

    // Пути к подпапкам
    private final String MODELS_DIR = "models";
    private final String MARKERS_DIR = "markers";
    private final String PREVIEWS_DIR = "previews";
    private final String SOUNDS_DIR = "sounds";
    private final String DESCRIPTIONS_DIR = "descriptions";

    public List<ModelDto.FullInfo> getAllModelsWithFullInfo() throws IOException {
        List<String> modelFiles = listModelFiles();
        List<ModelDto.FullInfo> models = new ArrayList<>();

        for (String modelFile : modelFiles) {
            String baseName = getBaseName(modelFile);
            ModelDto.FullInfo info = new ModelDto.FullInfo();

            info.setName(modelFile);
            info.setPreviewUrl(findImageFile(baseName));
            info.setDescription(getDescriptionContent(baseName));
            info.setModelUrl("/api/files/models/" + modelFile);
            info.setPatternUrl("/api/files/patterns/" + baseName + ".patt");
            info.setSoundUrl("/api/files/sounds/" + baseName + ".mp3");
            info.setIsCurrent(modelFile.equals(currentModel));

            models.add(info);
        }

        return models;
    }

    public ModelDto.DetailInfo getModelDetailInfo(String modelName) throws IOException {
        System.out.println("=== DEBUG getModelDetailInfo ===");
        System.out.println("Input modelName: " + modelName);

        // Если передано имя без расширения, добавляем .glb
        if (!modelName.toLowerCase().endsWith(".glb")) {
            modelName += ".glb";
            System.out.println("After adding .glb: " + modelName);
        }

        Path modelPath = Paths.get(storageLocation, MODELS_DIR, modelName);
        System.out.println("Looking for model file: " + modelPath.toAbsolutePath());
        System.out.println("Model file exists: " + Files.exists(modelPath));

        if (!Files.exists(modelPath)) {
            System.out.println("MODEL FILE NOT FOUND: " + modelPath);
            return null;
        }

        String baseName = getBaseName(modelName);
        ModelDto.DetailInfo info = new ModelDto.DetailInfo();

        info.setName(modelName);
        info.setPreviewUrl(findImageFile(baseName));
        info.setDescription(getDescriptionContent(baseName));
        info.setModelUrl("/api/files/models/" + modelName);
        info.setPatternUrl("/api/files/patterns/" + baseName + ".patt");
        info.setSoundUrl("/api/files/sounds/" + baseName + ".mp3");

        // Получаем размер файла и дату создания
        try {
            info.setFileSize(Files.size(modelPath));
            info.setCreatedAt(LocalDateTime.ofInstant(
                    Files.getLastModifiedTime(modelPath).toInstant(),
                    ZoneId.systemDefault()));
        } catch (IOException e) {
            info.setFileSize(0L);
            info.setCreatedAt(LocalDateTime.now());
        }

        return info;
    }

    // Новые методы для работы с подпапками

    private List<String> listModelFiles() throws IOException {
        Path modelsPath = Paths.get(storageLocation, MODELS_DIR);
        if (!Files.exists(modelsPath)) {
            return Collections.emptyList();
        }

        return Files.walk(modelsPath)
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().toLowerCase().endsWith(".glb"))
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
    }

    private String getDescriptionContent(String baseName) throws IOException {
        // Пробуем разные расширения для описания
        String[] possibleExtensions = { ".txt", ".md" };
        for (String ext : possibleExtensions) {
            Path descPath = Paths.get(storageLocation, DESCRIPTIONS_DIR, baseName + ext);
            if (Files.exists(descPath)) {
                return new String(Files.readAllBytes(descPath), StandardCharsets.UTF_8);
            }
        }
        return "";
    }

    private String findImageFile(String baseName) {
        String[] imageExtensions = { ".jpg", ".jpeg", ".png" };
        for (String ext : imageExtensions) {
            Path imagePath = Paths.get(storageLocation, PREVIEWS_DIR, baseName + ext);
            if (Files.exists(imagePath)) {
                return "/api/files/images/" + baseName + ext;
            }
        }
        return "";
    }

    // Обновляем методы для serving файлов с учетом подпапок
    public ResponseEntity<Resource> serveFile(String fileName, String fileType, String contentType) {
        try {
            // Определяем подпапку в зависимости от типа файла
            String subDir = getSubDirectory(fileType);
            Path filePath = Paths.get(storageLocation, subDir).resolve(fileName).normalize();

            System.out.println("Serving file from: " + filePath.toAbsolutePath());

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                System.out.println("File not found or not readable: " + filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("Error serving file: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    private String getSubDirectory(String fileType) {
        switch (fileType) {
            case "models":
                return MODELS_DIR;
            case "patterns":
                return MARKERS_DIR; // markers -> patterns в URL
            case "images":
                return PREVIEWS_DIR; // previews -> images в URL
            case "sounds":
                return SOUNDS_DIR;
            case "descriptions":
                return DESCRIPTIONS_DIR;
            default:
                return "";
        }
    }

    public ResponseEntity<Resource> serveImageFile(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
        String contentType = "image/";

        switch (extension) {
            case ".png":
                contentType += "png";
                break;
            case ".jpg":
                contentType += "jpeg";
                break;
            case ".jpeg":
                contentType += "jpeg";
                break;
            default:
                contentType = "application/octet-stream";
        }

        return serveFile(fileName, "images", contentType);
    }

    // Вспомогательные методы
    private String getBaseName(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? filename : filename.substring(0, dotIndex);
    }

    // Остальные методы остаются без изменений
    public boolean deleteModelAndRelatedFiles(String modelName) throws IOException {
        if (!modelName.toLowerCase().endsWith(".glb")) {
            modelName += ".glb";
        }

        String baseName = getBaseName(modelName);
        boolean deletedAny = false;

        // Удаляем из всех подпапок
        String[] fileTypes = { ".glb", ".patt", ".mp3", ".txt", ".jpg", ".jpeg", ".png" };
        Map<String, String> dirMapping = Map.of(
                ".glb", MODELS_DIR,
                ".patt", MARKERS_DIR,
                ".mp3", SOUNDS_DIR,
                ".txt", DESCRIPTIONS_DIR,
                ".jpg", PREVIEWS_DIR,
                ".jpeg", PREVIEWS_DIR,
                ".png", PREVIEWS_DIR);

        for (String ext : fileTypes) {
            String dir = dirMapping.get(ext);
            Path filePath = Paths.get(storageLocation, dir, baseName + ext);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                deletedAny = true;
                System.out.println("Deleted: " + filePath);
            }
        }

        if (modelName.equals(currentModel)) {
            currentModel = "";
        }

        return deletedAny;
    }

    public AppConfigDto getAppConfig() {
        AppConfigDto config = new AppConfigDto();
        config.setCurrentModel(currentModel);
        config.setCurrentPattern(
                currentModel != null && !currentModel.isEmpty() ? currentModel.replace(".glb", ".patt") : "");
        config.setAppVersion(appVersion);

        AppConfigDto.SupportedFormats formats = new AppConfigDto.SupportedFormats();
        formats.setModels(List.of(".glb"));
        formats.setImages(List.of(".jpg", ".png", ".jpeg"));
        formats.setSounds(List.of(".mp3"));
        formats.setPatterns(List.of(".patt"));

        config.setSupportedFormats(formats);
        return config;
    }

    public String saveFileWithModelAssociation(MultipartFile file, String type, String modelName)
            throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Файл пуст");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("Недопустимое имя файла");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();

        // Валидация расширений
        validateFileExtension(type, extension);

        // Определяем папку для сохранения
        String targetDir = getTargetDirectory(type);
        String finalFilename = modelName + extension;

        Path uploadPath = Paths.get(storageLocation, targetDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(finalFilename);

        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "Файл успешно загружен: " + finalFilename + " в " + targetDir;
    }

    private String getTargetDirectory(String type) {
        switch (type) {
            case "model":
                return MODELS_DIR;
            case "pattern":
                return MARKERS_DIR;
            case "image":
                return PREVIEWS_DIR;
            case "sound":
                return SOUNDS_DIR;
            case "description":
                return DESCRIPTIONS_DIR;
            default:
                return "";
        }
    }

    private void validateFileExtension(String type, String extension) {
        switch (type) {
            case "model":
                if (!".glb".equals(extension)) {
                    throw new IllegalArgumentException("Для моделей разрешены только файлы GLB");
                }
                break;
            case "image":
                if (!Arrays.asList(".png", ".jpg", ".jpeg").contains(extension)) {
                    throw new IllegalArgumentException("Для изображений разрешены только файлы PNG/JPG/JPEG");
                }
                break;
            case "description":
                if (!".txt".equals(extension)) {
                    throw new IllegalArgumentException("Для описания разрешены только текстовые файлы TXT");
                }
                break;
            case "pattern":
                if (!".patt".equals(extension)) {
                    throw new IllegalArgumentException("Для паттернов разрешены только файлы .patt");
                }
                break;
            case "sound":
                if (!".mp3".equals(extension)) {
                    throw new IllegalArgumentException("Для звуков разрешены только файлы MP3");
                }
                break;
            default:
                throw new IllegalArgumentException("Неизвестный тип файла: " + type);
        }
    }

    // Старые методы для совместимости
    public boolean validatePassword(String password) {
        return adminPassword.equals(password);
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public String getCurrentModel() {
        return currentModel;
    }

    public String getCurrentPattern() {
        return currentModel != null && !currentModel.isEmpty() ? currentModel.replace(".glb", ".patt") : "";
    }

    public void setCurrentModel(String model) {
        this.currentModel = model;
    }
}