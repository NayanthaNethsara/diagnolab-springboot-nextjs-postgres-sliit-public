package com.diagnolab.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.diagnolab.entity.Sample;
import com.diagnolab.repository.LabTestRepository;
import com.diagnolab.repository.SampleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diagnolab.entity.LabTest;
import com.diagnolab.entity.LabTest.SampleType;

import com.diagnolab.dto.TestCardDTO;

@Service
public class LabTestService {
    @Autowired
    private LabTestRepository testRepository;

    @Autowired
    private SampleRepository sampleRepository;

    public List<LabTest> getAllTests() {
        return testRepository.findAll();
    }

    public LabTest getTestsById(long id) {
        Optional<LabTest> tests = testRepository.findById(id);
        return tests.orElse(null);
    }

    public LabTest saveTests(LabTest test) {
        return testRepository.save(test);
    }

    public LabTest updateTests(long id, LabTest updatedTest) {
        Optional<LabTest> existingTestsOpt = testRepository.findById(id);

        if (existingTestsOpt.isPresent()) {
            LabTest existingTest = existingTestsOpt.get();

            existingTest.setTestName(
                    updatedTest.getTestName() != null ? updatedTest.getTestName() : existingTest.getTestName());
            existingTest
                    .setTestDescription(updatedTest.getTestDescription() != null ? updatedTest.getTestDescription()
                            : existingTest.getTestDescription());
            existingTest.setTestPrice(updatedTest.getTestPrice());
            existingTest.setSampleType(updatedTest.getSampleType());
            existingTest.setRefRange(
                    updatedTest.getRefRange() != null ? updatedTest.getRefRange() : existingTest.getRefRange());

            return testRepository.save(existingTest);
        } else {
            return null;
        }
    }


    public List<LabTest> getTestsBySampleType(SampleType sampleType) {
        return testRepository.findBySampleType(sampleType);
    }

    public List<TestCardDTO> getAllTestCards() {
        List<LabTest> tests = testRepository.findAll();

        return tests.stream().map(test -> {
            return new TestCardDTO(test.getId(), test.getTestName(), test.getTestDescription(), test.getTestPrice(),
                    test.getSampleType());

        }).collect(Collectors.toList());

    }

    // Change Test Availability
    public LabTest changeTestAvailability(long id) {
        Optional<LabTest> tests = testRepository.findById(id);

        if (tests.isPresent()) {
            LabTest test = tests.get();
            test.setAvailability(!test.getAvailability());
            return testRepository.save(test);
        } else {
            return null;
        }
    }

    public List<TestCardDTO> getAvailableTestCards() {
        List<LabTest> tests = testRepository.findByAvailability(true);

        return tests.stream().map(test -> {
            return new TestCardDTO(test.getId(), test.getTestName(), test.getTestDescription(), test.getTestPrice(),
                    test.getSampleType());

        }).collect(Collectors.toList());
    }

    public boolean canTestBeDeleted(long testId) {
        try {
            // Check if the test exists
            if (!testRepository.existsById(testId)) {
                return false; // Test does not exist
            }

            // Check if the test is used in any Sample
            boolean isUsedInSample = sampleRepository.existsByTestId(testId);
            return !isUsedInSample; // Can be deleted if not used in any sample
        } catch (Exception e) {
            throw new RuntimeException("Error checking if test can be deleted: " + e.getMessage(), e);
        }
    }

    public boolean deleteTestIfUnused(long testId) {
        try {
            // Check if the test can be deleted
            if (canTestBeDeleted(testId)) {
                testRepository.deleteById(testId);
                return true; // Test successfully deleted
            } else {
                throw new IllegalStateException("Test is in use and cannot be deleted");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error deleting test: " + e.getMessage(), e);
        }
    }


}
