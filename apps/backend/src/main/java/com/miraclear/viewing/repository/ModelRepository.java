package com.miraclear.viewing.repository;

import com.miraclear.viewing.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ModelRepository extends JpaRepository<Model, Long> {
    Optional<Model> findByFileName(String fileName);
    boolean existsByFileName(String fileName);
    List<Model> findByFileNameIn(Collection<String> fileNames);
}