package com.diagnolab.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.diagnolab.dto.PatientSearchCardDTO;
import com.diagnolab.dto.PatientSummeryWithRecentTestsDto;
import com.diagnolab.entity.Patient;
import com.diagnolab.service.PatientService;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/Patient") // Base URL for this controller
public class PatientController {

    @Autowired
    private PatientService PatientService; // Service layer to handle business logic

    // 1. Create a new patient
    @PostMapping("/add")
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        Patient savedPatient = PatientService.savePatient(patient);
        return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
    }

    // 2. Get all Patient
    @GetMapping("/all")
    public ResponseEntity<List<Patient>> getAllPatient() {
        List<Patient> PatientList = PatientService.getAllPatient();
        return new ResponseEntity<>(PatientList, HttpStatus.OK);
    }

    // 4. Update an existing patient
    @PutMapping("/Update/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable String id, @RequestBody Patient updatedPatient) {
        Optional<Patient> patient = PatientService.updatePatient(id, updatedPatient);
        return patient.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 5. Delete a patient by ID
    @DeleteMapping("/Delete/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        if (PatientService.deletePatient(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/SummeryWithRecentTests/all")
    public List<PatientSummeryWithRecentTestsDto> getAllPatientSummaries() {
        return PatientService.getAllPatientSummaries();
    }

    @GetMapping("/SearchCard/all")
    public List<PatientSearchCardDTO> getAllPatientSearchCards() {
        return PatientService.getAllPatientSearchCards();
    }

    @GetMapping("/Check/{id}")
    public ResponseEntity<Map<String, Boolean>> checkIfPatientExists(@PathVariable String id) {
        boolean exists = PatientService.getPatientByPatientId(id).isPresent();
        Map<String, Boolean> response = Collections.singletonMap("exists", exists);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Patient>>  getPatientByPatientId(@PathVariable String id) {
        Optional<Patient> patient = PatientService.getPatientByPatientId(id);
        return new ResponseEntity<>(patient,HttpStatus.OK);
    }


}
