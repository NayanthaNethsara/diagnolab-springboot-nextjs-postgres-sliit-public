package com.diagnolab.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SampleTestResultDTO {

    private long testResultId;
    private String testName;
    private String result;
    private boolean isVerified;
    private String referenceRange;


}
