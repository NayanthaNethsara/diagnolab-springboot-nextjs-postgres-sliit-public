package com.diagnolab.service;

import com.diagnolab.dto.SampleTestResultDTO;
import com.diagnolab.entity.Patient;
import com.diagnolab.entity.LabTest;
import com.diagnolab.entity.TestResult;
import com.diagnolab.entity.user.User;
import com.diagnolab.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diagnolab.dto.SampleDTO;
import com.diagnolab.entity.Sample;
import com.diagnolab.dto.SampleRequestDTO;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SampleService {

    @Autowired
    private SampleRepository sampleRepository;

    @Autowired
    private PatientRepository patientRepository;


    @Autowired
    private LabTestRepository testRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private BillRepository billRepository;


    @Transactional
    public void createSample(SampleRequestDTO sampleRequest) {


        // Retrieve the patient
        Patient patient = patientRepository.findById(sampleRequest.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Retrieve associated tests
        List<LabTest> tests = testRepository.findAllById(sampleRequest.getTestIds());
        String barcode = generateBarcode(patient.getPatientId(), sampleRequest.getSampleType());


        // Set up the Sample
        Sample sample = new Sample();
        sample.setSampleType(sampleRequest.getSampleType());
        sample.setBarcode(barcode);
        sample.setLabemployee(sampleRequest.getLabEmployee());
        sample.setPatient(patient);
        sample.setBill(billRepository.findById(sampleRequest.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found")));

        // Initialize TestResult objects with null values for results
        List<TestResult> testResults = tests.stream()
                .map(test -> {
                    TestResult testResult = new TestResult();
                    testResult.setSample(sample);  // Associate with the sample
                    testResult.setLabTest(test);  // Associate with the test
                    testResult.setResult(null);   // Set the result to null
                    return testResult;
                })
                .collect(Collectors.toList());

        // Set the testResults in the sample
        sample.setSampleTestResults(testResults);

        // Save the Sample (this will cascade the TestResult entities)
        sampleRepository.save(sample);
    }

    @Transactional
    public List<SampleDTO> getAllSamples() {
        List<Sample> samples = sampleRepository.findAll();
        return samples.stream()
                .map(sample -> new SampleDTO(
                        sample.getId(),
                        sample.getSampleType(),
                        sample.getPatient().getPatientId(),
                        sample.getPatient().getFirstName() + " " +  sample.getPatient().getLastName(), // Assuming Patient entity has a getName method
                        sample.getStatus(),
                        sample.getCollectedDate(),
                        sample.getCompletedDate(),
                        sample.getBarcode(),
                        sample.getLabemployee(), // Assuming LabEmployee (User) has a getName method
                        sample.getSampleTestResults().stream()
                                .map(testResult -> new SampleTestResultDTO(
                                        testResult.getId(),
                                        testResult.getLabTest().getTestName(), // Assuming LabTest has a getTestName method
                                        testResult.getResult(),
                                        testResult.isVerified(),
                                        testResult.getLabTest().getRefRange() // Assuming LabTest has a referenceRange field
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    private String generateBarcode(String patientId, LabTest.SampleType sampleType) {
        // Combine relevant fields to generate a short unique barcode
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm")); // 10 characters
        String uniqueId = UUID.randomUUID().toString().substring(0, 2); // 2 characters
        return sampleType.name().charAt(0) + patientId.substring(0, 2).toUpperCase() + timestamp + uniqueId;
    }


    @Transactional
    public void deleteSample(Long sampleId) {
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new RuntimeException("Sample not found"));

        // Check if the sample is completed
        if (sample.getStatus() == Sample.SampleStatus.COMPLETED) {
            throw new RuntimeException("Cannot delete completed sample");
        }

        sampleRepository.delete(sample);
    }

    @Transactional
    public void updateSample(Long sampleId, SampleDTO sampleDTO) {
        Sample sample = sampleRepository.findById(sampleId)
                .orElseThrow(() -> new RuntimeException("Sample not found"));

        // Check if the sample is completed
        if (sample.getStatus() == Sample.SampleStatus.COMPLETED) {
            throw new RuntimeException("Cannot update completed sample");
        }

        // Update the sample
        sample.setSampleType(sampleDTO.getSampleType());
        sample.setStatus(sampleDTO.getStatus());
        sample.setCollectedDate(sampleDTO.getCollectedDate());
        sample.setCompletedDate(sampleDTO.getCompletedDate());
        sample.setBarcode(sampleDTO.getBarcode());
        sample.setLabemployee(sampleDTO.getCollectedBy());

        // Update the associated TestResults
        List<TestResult> testResults = sample.getSampleTestResults();
        for (int i = 0; i < testResults.size(); i++) {
            TestResult testResult = testResults.get(i);
            SampleTestResultDTO testResultDTO = sampleDTO.getRequestedTests().get(i);

            testResult.setResult(testResultDTO.getResult());
            testResult.setVerified(testResultDTO.isVerified());
        }

        sampleRepository.save(sample);
    }




}
