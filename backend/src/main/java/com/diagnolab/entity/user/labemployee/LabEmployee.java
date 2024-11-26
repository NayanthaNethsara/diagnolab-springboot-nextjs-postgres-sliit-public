package com.diagnolab.entity.user.labemployee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;

import com.diagnolab.entity.user.User;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.persistence.PrePersist;

@Entity
@Table(name = "lab_employee")
public class LabEmployee extends User {

    public enum WorkShift {
        MORNING,
        EVENING,
        NIGHT
    }

    public enum Department {
        PSYCHOLOGY,
        CARDIOLOGY,
        DERMATOLOGY,
        GENERAL
    }

    @Column(name = "labEmployee_id")
    private String labEmployee_id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "date_of_birth")
    private LocalDate dateofBirth;

    @Column(name = "work_shift", nullable = false)
    @Enumerated(EnumType.STRING)
    private WorkShift workShift;

    @Column(name = "department", nullable = false)
    @Enumerated(EnumType.STRING)
    private Department department;

    @PrePersist
    private void generateId() {
        String prefix = getPrefixForDepartment(this.department);
        this.labEmployee_id = String.format("%s%04d", prefix, id);
    }

    private String getPrefixForDepartment(Department speciality) {
        // Use enum values directly in the switch case
        switch (speciality) {
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
