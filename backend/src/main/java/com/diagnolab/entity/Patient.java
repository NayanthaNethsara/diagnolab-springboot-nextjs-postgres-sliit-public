package com.diagnolab.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.diagnolab.entity.user.User.Gender;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "patients") // Maps the entity to the "patients" table
public class Patient {

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TestResult> testResults;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Sample> samples;

    @Id
    @Column(name = "patient_id", nullable = false, unique = true, length = 20)
    private String patientId;

    @Column(name = "first_name", nullable = false, length = 50) // Ensure correct field length
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "date_of_birth" , nullable = false)
    private LocalDate dateOfBirth;

    @Transient
    private Integer age;

    @PostLoad
    @PostPersist
    @PostUpdate
    private void calculateAge() {
        if (this.dateOfBirth != null) {
            this.age = LocalDate.now().getYear() - this.dateOfBirth.getYear();
        } else {
            this.age = null;
        }
    }

    public Integer getAge() {
        return age;
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10 , nullable = false)
    private Gender gender;

    @Column(name = "nic", length = 12)
    private String nic;

    @Column(name = "phone_number", length = 15 , nullable = false)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @Column(name = "registration_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime registrationDate = LocalDateTime.now();

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 15)
    private String emergencyContactPhone;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

}
