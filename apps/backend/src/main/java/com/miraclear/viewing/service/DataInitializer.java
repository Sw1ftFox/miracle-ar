package com.miraclear.viewing.service;

import com.miraclear.viewing.entity.Category;
import com.miraclear.viewing.entity.Role;
import com.miraclear.viewing.entity.User;
import com.miraclear.viewing.repository.CategoryRepository;
import com.miraclear.viewing.repository.RoleRepository;
import com.miraclear.viewing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    private final CategoryRepository categoryRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    DataInitializer(CategoryRepository categoryRepository) {
      this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DataInitializer started ===");
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("ROLE_ADMIN"));
            roleRepository.save(new Role("ROLE_MODERATOR"));
            roleRepository.save(new Role("ROLE_USER"));
        }
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").get();
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        }
        if (categoryRepository.findByName("Другие").isEmpty()) {
            Category other = new Category();
            other.setName("Другие");
            other.setDescription("Модели без категории");
            User admin = userRepository.findByEmail("admin@example.com").orElseThrow();
            other.setCreatedBy(admin);
            categoryRepository.save(other);
        }
    }
}