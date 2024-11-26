package com.diagnolab.repository;

import com.diagnolab.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diagnolab.entity.Sample;

import java.util.List;
import java.util.Optional;

@Repository
public interface SampleRepository extends JpaRepository<Sample, Long> {

    Optional<Sample> findByBarcode(String barcode);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Sample s JOIN s.sampleTestResults tr " +
            "WHERE tr.labTest.id = :testId")
    boolean existsByTestId(@Param("testId") Long testId);



}
