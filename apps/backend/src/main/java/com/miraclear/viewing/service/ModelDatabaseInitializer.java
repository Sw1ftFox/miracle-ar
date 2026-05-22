package com.miraclear.viewing.service;

import com.miraclear.viewing.entity.Model;
import com.miraclear.viewing.repository.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ModelDatabaseInitializer implements CommandLineRunner {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private StorageService storageService;

    @Override
    public void run(String... args) throws Exception {
        for (String fileName : storageService.getModelFiles()) {
            String baseName = fileName.replace(".glb", "");
            if (!modelRepository.existsByFileName(baseName)) {
                Model model = new Model();
                model.setFileName(baseName);
                model.setDisplayName(baseName); 
                modelRepository.save(model);
            }
        }
    }
}