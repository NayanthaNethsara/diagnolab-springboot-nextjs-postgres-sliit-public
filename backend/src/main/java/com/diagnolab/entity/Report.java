package com.diagnolab.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false) // Foreign key referencing Bill entity
    private Bill bill;  // Bill related to the report

    @Column(name = "completed_at", nullable = true)
    private LocalDateTime completedAt;

    @Column(name = "status", nullable = false, length = 255)
    private String status;
}
