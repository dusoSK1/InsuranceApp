package com.example.InsuranceApp_Backend.controller;

import com.example.InsuranceApp_Backend.model.User;
import com.example.InsuranceApp_Backend.repository.UserRepository;
import com.example.InsuranceApp_Backend.config.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "https://47947dcbe5e4.ngrok-free.app"}, allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(409).body(Map.of("error", "User with this email already exists!"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        savedUser.setPassword(null);
        return ResponseEntity.ok(Map.of("user", savedUser));
    }

    // LOGIN - vracia JWT token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            System.out.println("Attempt login for: " + loginRequest.getEmail());
            System.out.println("Password sent: " + loginRequest.getPassword());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Ak sa autentifikácia podarila
            String token = jwtTokenProvider.generateToken(authentication);

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            user.setPassword(null);

            System.out.println("Login successful for: " + loginRequest.getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", user
            ));

        } catch (Exception ex) {
            System.out.println("Login failed for: " + loginRequest.getEmail());
            ex.printStackTrace(); // toto ti ukáže presnú príčinu (UserNotFound alebo BadCredentials)
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
    }
}
