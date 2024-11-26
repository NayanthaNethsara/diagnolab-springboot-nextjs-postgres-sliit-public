package com.diagnolab.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tests")
public class LabTest {

    public enum SampleType {
        BLOOD, URINE, STOOL, SALIVA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @Column(name = "test_description", nullable = true)
    private String testDescription;

    @Column(name = "test_price", nullable = false)
    private double testPrice;

    @Column(name = "ref_range", nullable = true)
    private String refRange;

    @Column(name = "measuring_unit", nullable = true)
    private String measuringUnit = "mcg/dL";

    @Column(name = "sample_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private SampleType sampleType;

    @Column(name = "availability", nullable = true)
    private Boolean availability = true;

    @OneToMany(mappedBy = "labTest", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TestResult> sampleTestResults = new ArrayList<>();


}
