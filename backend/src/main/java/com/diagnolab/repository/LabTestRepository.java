package com.diagnolab.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.diagnolab.entity.LabTest.SampleType;
import com.diagnolab.entity.LabTest;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {

    List<LabTest> findBySampleType(LabTest.SampleType sampleType);

    List<LabTest> findByAvailability(boolean b);


}
