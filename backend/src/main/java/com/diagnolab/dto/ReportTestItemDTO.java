package com.diagnolab.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportTestItemDTO {
    private String testName;
    private String result;
    private String referenceRange;
}
