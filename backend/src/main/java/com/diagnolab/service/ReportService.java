package com.diagnolab.service;

import com.diagnolab.dto.ReportDTO;
import com.diagnolab.dto.ReportTestItemDTO;
import com.diagnolab.entity.Bill;
import com.diagnolab.entity.Report;
import com.diagnolab.entity.Sample;
import com.diagnolab.repository.BillRepository;
import com.diagnolab.repository.ReportRepository;
import com.diagnolab.repository.SampleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private SampleRepository sampleRepository;

    @Autowired
    private BillRepository billRepository;

    @Transactional
    public void generateEmptyReport(Long billId) {
       // Retrieve the bill
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        // Create the report
        Report report = new Report();
        report.setBill(bill);

        // Save the report
        reportRepository.save(report);
    }

    @Transactional
    public void deleteReport(Long reportId) {
        // Retrieve the report
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Delete the report
        reportRepository.delete(report);
    }

    @Transactional
    public List<ReportDTO> getAllReports() {
        return reportRepository.findAll().stream().map(report -> {
            boolean isCompleted = report.getCompletedAt() != null;
            ReportDTO reportDTO = new ReportDTO();

            // Setting report details
            reportDTO.setReportId(report.getReportId());
            reportDTO.setPatientId(report.getBill().getPatient().getPatientId());
            reportDTO.setPatientName(report.getBill().getPatient().getFirstName() + " " + report.getBill().getPatient().getLastName());
            reportDTO.setPatientPhone(report.getBill().getPatient().getPhoneNumber());
            reportDTO.setPatientGender(report.getBill().getPatient().getGender());
            reportDTO.setPatientDOB(report.getBill().getPatient().getDateOfBirth());
            reportDTO.setCompletedAt(isCompleted ? report.getCompletedAt().toString() : "Not completed");
            reportDTO.setStatus(report.getStatus()); // Assuming status is present in the report

            // Mapping Test Results from Samples associated with the Bill
            List<ReportTestItemDTO> testResults = report.getBill().getSamples().stream()
                    .map(Sample::getSampleTestResults) // Get all test results from samples
                    .flatMap(List::stream) // Flatten the list of test results
                    .map(testResult -> {
                        ReportTestItemDTO testItemDTO = new ReportTestItemDTO();
                        testItemDTO.setTestName(testResult.getLabTest().getTestName());
                        testItemDTO.setResult(testResult.getResult());
                        testItemDTO.setReferenceRange(testResult.getLabTest().getRefRange());
                        return testItemDTO;
                    })
                    .collect(Collectors.toList());

            reportDTO.setTestResults(testResults); // Setting the test results

            return reportDTO;
        }).collect(Collectors.toList());
    }





}
