package com.miraclear.viewing.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ModelResponseDto {
    private Long id;
    private String fileName;
    private String displayName;
    private String description;
    private String previewUrl;
    private String patternUrl;
    private String soundUrl;
    private String videoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Long> categoryIds;

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPreviewUrl() { return previewUrl; }
    public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }

    public String getPatternUrl() { return patternUrl; }
    public void setPatternUrl(String patternUrl) { this.patternUrl = patternUrl; }

    public String getSoundUrl() { return soundUrl; }
    public void setSoundUrl(String soundUrl) { this.soundUrl = soundUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Long> getCategoryIds() { return categoryIds; }
    public void setCategoryIds(List<Long> categoryIds) { this.categoryIds = categoryIds; }
}