package com.diagnolab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diagnolab.entity.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {

}