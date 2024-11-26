package com.diagnolab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diagnolab.entity.user.doctor.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}