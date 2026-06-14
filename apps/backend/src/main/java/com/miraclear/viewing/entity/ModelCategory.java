package com.miraclear.viewing.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "model_categories")
public class ModelCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model_file_name", nullable = false)
    private String modelFileName;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public ModelCategory() {}
    public ModelCategory(String modelFileName, Category category) {
        this.modelFileName = modelFileName;
        this.category = category;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getModelFileName() { return modelFileName; }
    public void setModelFileName(String modelFileName) { this.modelFileName = modelFileName; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}