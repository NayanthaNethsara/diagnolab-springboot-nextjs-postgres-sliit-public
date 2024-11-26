package com.diagnolab.dto;

import com.diagnolab.entity.Sample;
import com.diagnolab.entity.LabTest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SampleRequestDTO
{
    private Long billId; // ID of the bill
    private LabTest.SampleType sampleType;
    private LocalDateTime collectedDate;
    private String labEmployee; // ID of the lab employee
    private String patientId; // ID of the patient
    private List<Long> testIds; // IDs of associated tests

}
