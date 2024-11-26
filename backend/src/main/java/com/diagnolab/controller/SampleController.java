package com.diagnolab.controller;

import com.diagnolab.dto.SampleRequestDTO;
import com.diagnolab.entity.Sample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.diagnolab.dto.SampleDTO;
import com.diagnolab.service.SampleService;

import java.util.List;

@RestController
@RequestMapping("/api/Sample")
public class SampleController {

    @Autowired
    private SampleService sampleService;


    @PostMapping("/add")
    public ResponseEntity<String> createSample(@RequestBody SampleRequestDTO sampleRequest) {
        sampleService.createSample(sampleRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("SampleCreated Successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<SampleDTO>> getAllSamples() {
        return ResponseEntity.ok(sampleService.getAllSamples());
    }



}
