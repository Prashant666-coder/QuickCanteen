package com.quickcanteen.controller;

import com.quickcanteen.model.User;
import com.quickcanteen.repo.InMemoryStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User payload) {
        if (payload.getUsername() == null || payload.getUsername().isBlank() ||
                payload.getPassword() == null || payload.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
        }
        if (InMemoryStore.usernameExists(payload.getUsername())) {
            return ResponseEntity.status(409).body(Map.of("error", "Username already exists"));
        }
        InMemoryStore.addUser(new User(payload.getUsername(), payload.getPassword()));
        String token = InMemoryStore.issueToken(payload.getUsername());
        Map<String, Object> resp = new HashMap<>();
        resp.put("username", payload.getUsername());
        resp.put("token", token);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User payload) {
        if (payload.getUsername() == null || payload.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));
        }
        return InMemoryStore.getUser(payload.getUsername())
                .filter(u -> u.getPassword().equals(payload.getPassword()))
                .<ResponseEntity<?>>map(u -> {
                    String token = InMemoryStore.issueToken(u.getUsername());
                    return ResponseEntity.ok(Map.of("username", u.getUsername(), "token", token));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing token"));
        }
        String token = authHeader.substring(7);
        return InMemoryStore.validateToken(token)
                .<ResponseEntity<?>>map(username -> ResponseEntity.ok(Map.of("username", username)))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid token")));
    }
}
