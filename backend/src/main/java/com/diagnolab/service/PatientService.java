package com.diagnolab.service;

import com.diagnolab.entity.Sample.SampleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.diagnolab.dto.PatientSearchCardDTO;
import com.diagnolab.dto.PatientSummeryWithRecentTestsDto;
import com.diagnolab.entity.Patient;
import com.diagnolab.entity.TestResult;
import com.diagnolab.repository.PatientRepository;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;


    public List<PatientSummeryWithRecentTestsDto> getAllPatientSummaries() {
        List<Patient> patients = patientRepository.findAll();

        return patients.stream().map(patient -> {
            // Calculate patient age
            int age = Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();

            // Get the recent 5 test data
            List<String> recentTests = patient.getTestResults().stream()
                    .sorted((t1, t2) -> t2.getResultDate().compareTo(t1.getResultDate())) // Sort by most recent
                    .limit(5)
                    .map(testResult -> testResult.getLabTest().getTestName()) // Correctly access the lab test name
                    .collect(Collectors.toList());


            // Get the most recent appointment date
            LocalDate recentAppointment = patient.getTestResults().stream()
                    .map(TestResult::getResultDate)
                    .max(LocalDate::compareTo)
                    .orElse(null); // If no test results, default to null

            // Determine test status based on sample statuses
            SampleStatus testStatus = patient.getSamples().stream()
                    .allMatch(sample -> sample.getStatus() == SampleStatus.COMPLETED)
                    ? SampleStatus.COMPLETED
                    : SampleStatus.PENDING;

            // Return the patient summary with recent tests, recent appointment, and test status
            return new PatientSummeryWithRecentTestsDto(
                    patient.getPatientId(),
                    patient.getFirstName(),
                    patient.getLastName(),
                    age,
                    recentTests,
                    testStatus,
                    recentAppointment
            );
        }).collect(Collectors.toList());
    }

    public List<PatientSearchCardDTO> getAllPatientSearchCards() {
        List<Patient> patients = patientRepository.findAll();

        return patients.stream().map(patient -> {
            return new PatientSearchCardDTO(patient.getPatientId(), patient.getFirstName(),
                    patient.getLastName(),
                    patient.getGender(), patient.getDateOfBirth().toString(), patient.getPhoneNumber(),
                    patient.getNic());
        }).collect(Collectors.toList());
    }

    public Optional<Patient> getPatientByPatientId(String patientId) {
        return patientRepository.findByPatientId(patientId);
    }

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatient() {
        return patientRepository.findAll();
    }

    public boolean deletePatient(String id) {
        if (patientRepository.existsByPatientId(id)) {
            patientRepository.deleteByPatientId(id); // Fix method name
            return true;
        }
        return false;
    }

    public Optional<Patient> updatePatient(String id, Patient updatedPatient) {
        return patientRepository.findByPatientId(id)
                .map(patient -> {
                    patient.setFirstName(updatedPatient.getFirstName());
                    patient.setLastName(updatedPatient.getLastName());
                    patient.setDateOfBirth(updatedPatient.getDateOfBirth());
                    patient.setGender(updatedPatient.getGender());
                    patient.setPhoneNumber(updatedPatient.getPhoneNumber());
                    patient.setEmail(updatedPatient.getEmail());
                    patient.setEmergencyContactName(updatedPatient.getEmergencyContactName());
                    patient.setEmergencyContactPhone(updatedPatient.getEmergencyContactPhone());
                    patient.setNotes(updatedPatient.getNotes());
                    return patientRepository.save(patient);
                });
    }
}
