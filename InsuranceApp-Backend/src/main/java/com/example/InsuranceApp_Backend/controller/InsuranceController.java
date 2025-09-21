package com.example.InsuranceApp_Backend.controller;

import com.example.InsuranceApp_Backend.model.Insurance;
import com.example.InsuranceApp_Backend.model.User;
import com.example.InsuranceApp_Backend.repository.InsuranceRepository;
import com.example.InsuranceApp_Backend.repository.UserRepository;
import com.example.InsuranceApp_Backend.config.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insurances")
@CrossOrigin(origins = {"http://localhost:5173","  https://47947dcbe5e4.ngrok-free.app"}, allowCredentials = "true")
public class InsuranceController {

    @Autowired
    private InsuranceRepository insuranceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Helper method to get current user from JWT
    private User getCurrentUserFromToken(String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getUsernameFromToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET – only own insurances
    @GetMapping
    public List<Insurance> getMyInsurances(@RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUserFromToken(authHeader);
        return insuranceRepository.findByUser(currentUser);
    }

    // POST – add new insurance
    @PostMapping
    public ResponseEntity<?> createInsurance(@Valid @RequestBody Insurance insurance,
                                             @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUserFromToken(authHeader);
        insurance.setUser(currentUser);

        boolean exists = insuranceRepository.existsByFirstNameAndLastNameAndUser(
                insurance.getFirstName(), insurance.getLastName(), currentUser);
        if (exists) {
            return ResponseEntity.status(409).body("Insurance with this name already exists!");
        }
        Insurance saved = insuranceRepository.save(insurance);
        return ResponseEntity.ok(saved);
    }

    // PUT – edit own insurance
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInsurance(@PathVariable Long id,
                                             @Valid @RequestBody Insurance insurance,
                                             @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUserFromToken(authHeader);

        return insuranceRepository.findById(id)
                .map(existing -> {
                    if (!existing.getUser().getId().equals(currentUser.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }
                    existing.setFirstName(insurance.getFirstName());
                    existing.setLastName(insurance.getLastName());
                    existing.setNumber(insurance.getNumber());
                    existing.setPhone(insurance.getPhone());
                    return ResponseEntity.ok(insuranceRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE – delete own insurance
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInsurance(@PathVariable Long id,
                                             @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUserFromToken(authHeader);

        return insuranceRepository.findById(id)
                .map(existing -> {
                    if (!existing.getUser().getId().equals(currentUser.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }
                    insuranceRepository.delete(existing);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
