package com.diagnolab.entity.user.doctor;

import com.diagnolab.entity.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors")
public class Doctor extends User {

    public enum Speciality {
        PSYCHOLOGY,
        CARDIOLOGY,
        DERMATOLOGY,
        GENERAL
    }

    @Column(name = "doctor_id")
    private String doctor_id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "speciality", nullable = false)
    @Enumerated(EnumType.STRING)
    private Speciality speciality;

    @Column(name = "address", nullable = false)
    private String address;

    @PrePersist
    private void generateId() {
        String prefix = getPrefixForSpeciality(this.speciality);
        this.doctor_id = String.format("%s%04d", prefix, id);
    }

    private String getPrefixForSpeciality(Speciality speciality) {
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
