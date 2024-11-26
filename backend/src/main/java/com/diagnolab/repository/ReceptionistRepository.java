package com.diagnolab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diagnolab.entity.user.receptionist.Receptionist;

public interface ReceptionistRepository extends JpaRepository<Receptionist, Long> {

}