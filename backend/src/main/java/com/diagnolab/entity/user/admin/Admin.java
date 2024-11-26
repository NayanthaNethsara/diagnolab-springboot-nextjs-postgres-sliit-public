package com.diagnolab.entity.user.admin;

import java.time.LocalDate;

import com.diagnolab.entity.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin")
public class Admin extends User {

    public enum Department {
        PSYCHOLOGY,
        CARDIOLOGY,
        DERMATOLOGY,
        GENERAL
    }

    @Column(name = "department", nullable = false)
    @Enumerated(EnumType.STRING)
    private Department department;

    @Column(name = "date_of_birth")
    private LocalDate dateofBirth;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "admin_id")
    private String admin_id;

    @PrePersist
    private void generateId() {
        String prefix = getPrefixForDepartment(this.department);
        this.admin_id = String.format("%s%04d", prefix, id);
    }

    private String getPrefixForDepartment(Department department) {
        // Use enum values directly in the switch case
        switch (department) {
            case PSYCHOLOGY:
                return "DPHY";
            case CARDIOLOGY:
                return "DCAR";
            case DERMATOLOGY:
                return "DDER";
            case GENERAL:
            default:
                return "DGEN"; // General or default prefix if unknown
        }
    }

}
