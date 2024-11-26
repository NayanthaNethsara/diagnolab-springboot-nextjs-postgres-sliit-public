package com.diagnolab.service;

import com.diagnolab.entity.LabTest;
import com.diagnolab.entity.Sample;
import com.diagnolab.entity.TestResult;
import com.diagnolab.repository.LabTestRepository;
import com.diagnolab.repository.SampleRepository;
import com.diagnolab.repository.TestResultRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TestResultService {

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private SampleRepository sampleRepository;

    @Autowired
    private LabTestRepository LabTestRepository;

    @Transactional
    public void addTestResult(Long sampleId, Long testId, String result) {
        // Retrieve the sample
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new RuntimeException("Sample not found"));

        // Retrieve the lab test
        LabTest labTest = LabTestRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        // Create the test result
        TestResult testResult = new TestResult();
        testResult.setSample(sample);
        testResult.setLabTest(labTest);
        testResult.setResult(result);

        // Save the test result
        testResultRepository.save(testResult);
    }

    @Transactional
    public void verifyTestResult(Long testResultId) {
        // Retrieve the test result
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new RuntimeException("Test result not found"));

        // Verify the test result
        testResult.setVerified(true);

        // Save the test result
        testResultRepository.save(testResult);
    }

    @Transactional
    public void editTestResult(Long testResultId, String result) {
        // Retrieve the test result
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new RuntimeException("Test result not found"));

        // Edit the test result
        testResult.setResult(result);

        // Save the test result
        testResultRepository.save(testResult);
    }

}
