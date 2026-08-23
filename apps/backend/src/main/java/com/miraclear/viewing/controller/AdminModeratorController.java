package com.miraclear.viewing.controller;

import com.miraclear.viewing.dto.ModeratorRequest;
import com.miraclear.viewing.entity.Role;
import com.miraclear.viewing.entity.User;
import com.miraclear.viewing.repository.RoleRepository;
import com.miraclear.viewing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/moderators")
public class AdminModeratorController {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> listModerators() {
        List<Map<String, Object>> moderators = userRepository.findAll().stream()
            .filter(user -> user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_MODERATOR")))
            .map(user -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", user.getId());
                map.put("email", user.getEmail());
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(moderators);
    }

    @PostMapping
    public ResponseEntity<?> createModerator(@RequestBody ModeratorRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password required");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Role role = roleRepository.findByName("ROLE_MODERATOR").orElseThrow();
        user.setRoles(Set.of(role));
        userRepository.save(user);
        return ResponseEntity.ok("Moderator created");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteModerator(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        boolean isModerator = user.getRoles().stream()
            .anyMatch(r -> r.getName().equals("ROLE_MODERATOR"));
        if (!isModerator) return ResponseEntity.badRequest().body("Not a moderator");
        userRepository.delete(user);
        return ResponseEntity.ok("Moderator deleted");
    }
}