package com.example.viewing.controller;

import com.example.viewing.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final StorageService storageService;

    public ApiController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/admin/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticateAdmin(@RequestBody AuthenticationRequest request) {
        boolean authenticated = storageService.validatePassword(request.getPassword());

        AuthenticationResponse response = new AuthenticationResponse();
        response.setAuthenticated(authenticated);

        if (authenticated) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/app/config")
    public ResponseEntity<AppConfig> getAppConfig() {
        AppConfig config = new AppConfig();
        config.setCurrentModel(storageService.getCurrentModel());
        config.setCurrentPattern(storageService.getCurrentPattern());

        return ResponseEntity.ok(config);
    }

    // Вспомогательные DTO классы
    public static class AuthenticationRequest {
        private String password;

        // геттеры и сеттеры
        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class AuthenticationResponse {
        private boolean authenticated;

        // геттеры и сеттеры
        public boolean isAuthenticated() {
            return authenticated;
        }

        public void setAuthenticated(boolean authenticated) {
            this.authenticated = authenticated;
        }
    }

    public static class AppConfig {
        private String currentModel;
        private String currentPattern;

        // геттеры и сеттеры
        public String getCurrentModel() {
            return currentModel;
        }

        public void setCurrentModel(String currentModel) {
            this.currentModel = currentModel;
        }

        public String getCurrentPattern() {
            return currentPattern;
        }

        public void setCurrentPattern(String currentPattern) {
            this.currentPattern = currentPattern;
        }
    }
}