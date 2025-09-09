package com.example.InsuranceApp_Backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "insurances")
public class Insurance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Firstname is mandatory")
    private String firstName;

    @NotBlank(message = "Lastname is mandatory")
    private String lastName;

    @NotBlank(message = "Insurance number is mandatory")
    private String number;

    @NotBlank(message = "Phone number is mandatory")
    private String phone;

    // -----------------------------
    // adding ManyToOne relationship with User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    // -----------------------------

    public Insurance() {}

    public Insurance(String firstName, String lastName, String number, String phone, User user) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.number = number;
        this.phone = phone;
        this.user = user;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
