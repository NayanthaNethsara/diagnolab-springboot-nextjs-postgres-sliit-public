package com.diagnolab.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diagnolab.dto.TestCardDTO;
import com.diagnolab.entity.LabTest;
import com.diagnolab.service.LabTestService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/Tests")
public class TestsController {
    @Autowired
    private LabTestService testsService;

    // Get All Tests
    @GetMapping("/all")
    public ResponseEntity<List<LabTest>> getAllTests() {
        List<LabTest> testList = testsService.getAllTests();
        return new ResponseEntity<>(testList, HttpStatus.OK);
    }

    // Get a test by ID
    @GetMapping("/{id}")
    public ResponseEntity<LabTest> getTestById(@PathVariable Long id) {
        Optional<LabTest> test = Optional.ofNullable(testsService.getTestsById(id));
        return test.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Save New Test
    @PostMapping("/add")
    public ResponseEntity<LabTest> addPatient(@RequestBody LabTest test) {
        LabTest savedTest = testsService.saveTests(test);
        return new ResponseEntity<>(savedTest, HttpStatus.CREATED);
    }

    // Update Test
    @PutMapping("/update/{id}")
    public ResponseEntity<LabTest> updateTest(@PathVariable Long id, @RequestBody LabTest test) {
        LabTest updatedTest = testsService.updateTests(id, test);
        return new ResponseEntity<>(updatedTest, HttpStatus.OK);
    }

    // Get All Test Card
    @GetMapping("/card/all")
    public ResponseEntity<List<TestCardDTO>> getAllTestCard() {
        List<TestCardDTO> testList = testsService.getAllTestCards();
        return new ResponseEntity<>(testList, HttpStatus.OK);
    }

    // Get All Available Test Card
    @GetMapping("/card/available")
    public ResponseEntity<List<TestCardDTO>> getAvailableTestCard() {
        List<TestCardDTO> testList = testsService.getAvailableTestCards();
        return new ResponseEntity<>(testList, HttpStatus.OK);
    }

    // Delete Tes

    // Change Test Availability
    @PutMapping("/availability/{id}")
    public ResponseEntity<LabTest> changeAvailability(@PathVariable Long id) {
        LabTest updatedTest = testsService.changeTestAvailability(id);
        return new ResponseEntity<>(updatedTest, HttpStatus.OK);
    }

}
