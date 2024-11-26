package com.diagnolab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.diagnolab.entity.TestResult;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {

}
