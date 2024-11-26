package com.diagnolab.dto;

import com.diagnolab.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillResponseDTO {
    private long billId;
    private BigDecimal amount;
    private String PatientId;
    private String referenceNumber;
    private String paymentStatus;
    private LocalDateTime paymentDate;
    private String patientName;
    private User.Gender patientGender;
    private LocalDate patientDob;
    private String phoneNumber;
    private List<String> labTestNames;
    private String billedBy;
}
