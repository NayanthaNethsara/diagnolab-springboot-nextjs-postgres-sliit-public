package com.diagnolab.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.diagnolab.entity.LabTest.SampleType;
import com.diagnolab.entity.user.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Sample {

    public enum SampleStatus {
        COMPLETED,
        PENDING,
        PROCESSING,
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sample_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "sample_type")
    private SampleType sampleType;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private SampleStatus status = SampleStatus.PENDING;

    @Column(name = "collected_by")
    private String labemployee;

    @Column(name = "barcode", unique = true, nullable = true)
    private String barcode;

    @Column(name = "collected_date")
    private LocalDateTime collectedDate = LocalDateTime.now();

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private Patient patient;

    @OneToMany(mappedBy = "sample", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestResult> sampleTestResults = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = true) // Nullable for optional relationship
    private Bill bill;

}
