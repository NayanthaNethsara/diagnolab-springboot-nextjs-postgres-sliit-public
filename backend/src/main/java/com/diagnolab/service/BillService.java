package com.diagnolab.service;

import com.diagnolab.dto.BillRequestDTO;
import com.diagnolab.dto.BillResponseDTO;
import com.diagnolab.dto.SampleRequestDTO;
import com.diagnolab.entity.Bill;
import com.diagnolab.entity.LabTest;
import com.diagnolab.entity.Patient;
import com.diagnolab.entity.Sample;
import com.diagnolab.repository.BillRepository;
import com.diagnolab.repository.LabTestRepository;
import com.diagnolab.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillService {

    @Autowired
    BillRepository billRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    LabTestRepository labTestRepository;

    @Autowired
    SampleService sampleService;

    @Transactional
    public BillResponseDTO generate(BillRequestDTO billRequest) {
        // Retrieve the patient
        Patient patient = patientRepository.findById(billRequest.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Retrieve lab tests
        List<LabTest> labTests = labTestRepository.findAllById(billRequest.getLabTestIds());

        // Create a new bill
        Bill bill = new Bill();
        bill.setReferenceNumber("BILL-" + UUID.randomUUID().toString());
        bill.setPatient(patient);
        bill.setAmount(billRequest.getAmount());
        bill.setPaidStatus(Bill.PaidStatus.UNPAID);
        bill.setLabemployee(billRequest.getBilledBy());
        bill.setLabTests(labTests);
        bill.setPaidStatus(Bill.PaidStatus.PAID);

        // Save the Bill first to generate the billId
        billRepository.save(bill);



        // Create Samples using SampleService
        labTests.forEach(test -> {
            SampleRequestDTO sampleRequest = new SampleRequestDTO(
                    bill.getBillId(), // Use the saved bill's ID
                    test.getSampleType(),
                    LocalDateTime.now(),
                    billRequest.getBilledBy(),
                    billRequest.getPatientId(),
                    List.of(test.getId()) // Create a list with a single test ID
            );
            sampleService.createSample(sampleRequest); // Reuse the existing method
        });

        return getBillById(bill.getBillId());
    }

    @Transactional
    public List<BillResponseDTO> getAllBills() {
        List<Bill> bills = billRepository.findAll();
        return bills.stream().map(this::getBillResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteBill(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        // Check if accociated samples are completed
        if (bill.getSamples().stream().anyMatch(sample -> sample.getStatus() != Sample.SampleStatus.COMPLETED)) {
            throw new RuntimeException("Cannot delete bill with pending samples");
        }else{
            bill.getSamples().forEach(sample -> sampleService.deleteSample(sample.getId()));
            billRepository.deleteById(billId);
        }

    }

    @Transactional
    public BillResponseDTO getBillById(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        return getBillResponseDTO(bill);
    }

    private BillResponseDTO getBillResponseDTO(Bill bill) {
        Patient patient = bill.getPatient();
        BillResponseDTO billResponse = new BillResponseDTO();
        billResponse.setBillId(bill.getBillId());
        billResponse.setReferenceNumber(bill.getReferenceNumber());
        billResponse.setAmount(bill.getAmount());
        billResponse.setBilledBy(bill.getLabemployee());
        billResponse.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        billResponse.setPatientGender(patient.getGender());
        billResponse.setPatientDob(patient.getDateOfBirth());
        billResponse.setPatientId(patient.getPatientId());
        billResponse.setPhoneNumber(patient.getPhoneNumber());
        billResponse.setPaymentStatus(bill.getPaidStatus().name());
        billResponse.setPaymentDate(bill.getCreatedAt());
        billResponse.setLabTestNames(bill.getLabTests().stream().map(LabTest::getTestName).collect(Collectors.toList()));
        return billResponse;
    }

    @Transactional
    public void updateBill(Long billId, BillRequestDTO billRequest) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
    }

}
