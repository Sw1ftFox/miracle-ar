package com.example.viewing.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StorageService {

    @Value("${storage.location}")
    private String storageLocation;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${current.model}")
    private String currentModel;

    private String currentPattern;

    public String getStorageLocation() {
        return storageLocation;
    }

    public List<String> listModels() throws IOException {
        return Files.walk(Paths.get(storageLocation))
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().toLowerCase().endsWith(".glb"))
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
    }

    public List<String> listSounds() throws IOException {
        return Files.walk(Paths.get(storageLocation))
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().toLowerCase().endsWith(".mp3"))
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
    }

    public List<String> listPatterns() throws IOException {
        return Files.walk(Paths.get(storageLocation))
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().toLowerCase().endsWith(".patt"))
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
    }

    public String getCurrentModel() {
        return currentModel;
    }

    public String getCurrentPattern() {
        if (currentModel != null && !currentModel.isEmpty()) {
            return currentModel.replace(".glb", ".patt");
        }
        return "";
    }

    public void setCurrentModel(String model) {
        this.currentModel = model;
    }

    public boolean validatePassword(String password) {
        return adminPassword.equals(password);
    }

    public void saveFile(MultipartFile file, String type) throws IOException {
        Path uploadPath = Paths.get(storageLocation).toAbsolutePath().normalize();
        System.out.println("Saving to: " + uploadPath);

        if (!Files.exists(uploadPath)) {
            System.out.println("Creating directory: " + uploadPath);
            Files.createDirectories(uploadPath);
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new IOException("Invalid file name");
        }

        Path filePath = uploadPath.resolve(fileName);
        System.out.println("Full file path: " + filePath);

        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        System.out.println("File saved successfully: " + filePath);
    }

    public boolean deleteModel(String fileName) throws IOException {
        Path filePath = Paths.get(storageLocation, fileName);
        if (Files.exists(filePath)) {
            Files.delete(filePath);

            String soundFileName = fileName.replace(".glb", ".mp3");
            Path soundFilePath = Paths.get(storageLocation, soundFileName);
            if (Files.exists(soundFilePath)) {
                Files.delete(soundFilePath);
            }

            String patternFileName = fileName.replace(".glb", ".patt");
            Path patternFilePath = Paths.get(storageLocation, patternFileName);
            if (Files.exists(patternFilePath)) {
                Files.delete(patternFilePath);
            }

            String imageFileName = fileName.replace(".glb", ".png");
            Path imageFilePath = Paths.get(storageLocation, imageFileName);
            if (Files.exists(imageFilePath)) {
                Files.delete(imageFilePath);
            }

            String descriptionFileName = fileName.replace(".glb", ".txt");
            Path descriptionFilePath = Paths.get(storageLocation, descriptionFileName);
            if (Files.exists(descriptionFilePath)) {
                Files.delete(descriptionFilePath);
            }

            if (fileName.equals(currentModel)) {
                currentModel = "";
            }
            return true;
        }
        return false;
    }

    public boolean deleteSound(String fileName) throws IOException {
        Path filePath = Paths.get(storageLocation, fileName);
        if (Files.exists(filePath) && fileName.toLowerCase().endsWith(".mp3")) {
            Files.delete(filePath);
            return true;
        }
        return false;
    }

    public boolean deletePattern(String fileName) throws IOException {
        Path filePath = Paths.get(storageLocation, fileName);
        if (Files.exists(filePath) && fileName.toLowerCase().endsWith(".patt")) {
            Files.delete(filePath);
            return true;
        }
        return false;
    }

    public List<String> listImages() throws IOException {
        return Files.walk(Paths.get(storageLocation))
                .filter(Files::isRegularFile)
                .filter(path -> {
                    String filename = path.toString().toLowerCase();
                    return filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg");
                })
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
    }

    public List<String> listDescriptions() throws IOException {
        return Files.walk(Paths.get(storageLocation))
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().toLowerCase().endsWith(".txt"))
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
    }

    public String getDescriptionContent(String fileName) throws IOException {
        Path filePath = Paths.get(storageLocation, fileName);
        if (Files.exists(filePath)) {
            return new String(Files.readAllBytes(filePath), StandardCharsets.UTF_8);
        }
        return "";
    }

    public boolean deleteImage(String fileName) throws IOException {
        Path filePath = Paths.get(storageLocation, fileName);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            return true;
        }
        return false;
    }

    public boolean deleteDescription(String fileName) throws IOException {
        Path filePath = Paths.get(storageLocation, fileName);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            return true;
        }
        return false;
    }
}