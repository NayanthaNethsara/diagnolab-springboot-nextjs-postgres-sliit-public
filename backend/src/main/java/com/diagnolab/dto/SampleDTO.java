package com.diagnolab.dto;

import com.diagnolab.entity.Sample.SampleStatus;
import com.diagnolab.entity.LabTest;
import com.diagnolab.entity.LabTest.SampleType;
import com.diagnolab.entity.TestResult;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SampleDTO {

    private Long sampleId;
    private SampleType sampleType;
    private String patientId;
    private String patientName;
    private SampleStatus status;
    private LocalDateTime collectedDate;
    private LocalDateTime completedDate;
    private String barcode;
    private String collectedBy;
    private List<SampleTestResultDTO> requestedTests;

}
