package com.diagnolab.entity;

import com.diagnolab.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bills")
public class Bill {

    public enum PaidStatus {
        PAID,
        UNPAID
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Long billId;

    @Column(name = "reference_number", nullable = false, unique = true)
    private String referenceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = true) // Foreign key referencing Patient entity
    private Patient patient;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sample> samples = new ArrayList<>(); // List of samples associated with this bill

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "bill_labtests",
            joinColumns = @JoinColumn(name = "bill_id"),
            inverseJoinColumns = @JoinColumn(name = "lab_test_id")
    )
    private List<LabTest> labTests = new ArrayList<>(); // List of LabTests directly billed

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "paid_status", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private PaidStatus paidStatus = PaidStatus.UNPAID;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @JoinColumn(name ="billed_by")
    private String labemployee;

    @Column(name="requested_tests")
    private List<String> requestedTests;
}
