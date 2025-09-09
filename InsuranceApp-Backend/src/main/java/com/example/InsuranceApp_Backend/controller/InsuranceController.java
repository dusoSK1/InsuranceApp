package com.example.InsuranceApp_Backend.controller;

import com.example.InsuranceApp_Backend.model.Insurance;
import com.example.InsuranceApp_Backend.model.User;
import com.example.InsuranceApp_Backend.repository.InsuranceRepository;
import com.example.InsuranceApp_Backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/insurances")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InsuranceController {

    @Autowired
    private InsuranceRepository insuranceRepository;

    @Autowired
    private UserRepository userRepository;

    // Method to get the current authenticated user
    private User getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        System.out.println("🔍 Session ID: " + session.getId());
        System.out.println("🔍 User in session: " + user);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔍 SecurityContext auth: " + auth);

        if (user != null) return user;
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found in DB"));
        }
        throw new RuntimeException("User not logged in");
    }


    // GET – only own insurances
    @GetMapping
    public List<Insurance> getMyInsurances(HttpSession session) {
        User currentUser = getCurrentUser(session);
        return insuranceRepository.findByUser(currentUser);
    }

    // POST – add new insurance
    @PostMapping
    public ResponseEntity<?> createInsurance(@Valid @RequestBody Insurance insurance, HttpSession session) {
        User currentUser = getCurrentUser(session);
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
    public ResponseEntity<?> updateInsurance(@PathVariable Long id, @Valid @RequestBody Insurance insurance, HttpSession session) {
        User currentUser = getCurrentUser(session);
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
    public ResponseEntity<?> deleteInsurance(@PathVariable Long id, HttpSession session) {
        User currentUser = getCurrentUser(session);
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
