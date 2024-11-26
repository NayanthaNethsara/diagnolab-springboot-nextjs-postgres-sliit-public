package com.diagnolab.entity.user.receptionist;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;

import com.diagnolab.entity.user.User;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@Table(name = "receptionist")
public class Receptionist extends User {

    public enum WorkShift {
        MORNING,
        EVENING,
        NIGHT
    }

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "date_of_birth")
    private LocalDate dateofBirth;

    @Column(name = "work_shift", nullable = false)
    @Enumerated(EnumType.STRING)
    private WorkShift workShift;

}