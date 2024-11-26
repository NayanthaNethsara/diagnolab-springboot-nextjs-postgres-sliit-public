package com.diagnolab.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillRequestDTO {
    private String referenceNumber;
    private String patientId;
    private List<Long> labTestIds;
    private BigDecimal amount;
    private String billedBy;
}
