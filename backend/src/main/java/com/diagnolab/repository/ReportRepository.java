package com.diagnolab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diagnolab.entity.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {

}