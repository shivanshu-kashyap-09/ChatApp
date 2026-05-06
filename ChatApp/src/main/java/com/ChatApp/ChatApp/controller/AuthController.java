package com.ChatApp.ChatApp.controller;

import com.ChatApp.ChatApp.Entity.UserEntity;
import com.ChatApp.ChatApp.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Value("${google.client.id}")
    private String googleClientId;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> data) {
        String idTokenString = data.get("token");
        
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                UserEntity user = userRepository.getByEmail(email);
                if (user == null) {
                    user = new UserEntity();
                    user.setEmail(email);
                    user.setUserName(name);
                    user.setVerified(true);
                    userRepository.save(user);
                }

                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(401).body("Invalid ID token.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying token: " + e.getMessage());
        }
    }
}
