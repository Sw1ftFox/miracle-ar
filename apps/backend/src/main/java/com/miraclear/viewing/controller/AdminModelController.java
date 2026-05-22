package com.miraclear.viewing.controller;

import com.miraclear.viewing.entity.Model;
import com.miraclear.viewing.repository.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/models")
public class AdminModelController {

    @Autowired
    private ModelRepository modelRepository;

    @GetMapping
    public List<Model> getAllModels() {
        return modelRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Model> getModel(@PathVariable Long id) {
        return modelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Model createModel(@RequestBody Model model) {
        return modelRepository.save(model);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Model> updateModel(@PathVariable Long id, @RequestBody Model model) {
        if (!modelRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        model.setId(id);
        return ResponseEntity.ok(modelRepository.save(model));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteModel(@PathVariable Long id) {
        modelRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}