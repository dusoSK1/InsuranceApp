package com.example.InsuranceApp_Backend.repository;

import com.example.InsuranceApp_Backend.model.Insurance;
import com.example.InsuranceApp_Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
    List<Insurance> findByUser(User user);
    boolean existsByFirstNameAndLastNameAndUser(String firstName, String lastName, User user);

}