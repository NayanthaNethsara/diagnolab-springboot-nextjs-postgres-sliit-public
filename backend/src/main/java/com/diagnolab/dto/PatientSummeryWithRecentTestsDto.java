package com.diagnolab.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.diagnolab.entity.Sample.SampleStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientSummeryWithRecentTestsDto {
    private String patientId;
    private String firstName;
    private String lastName;
    private int age;
    private List<String> recentTests;
    private SampleStatus reportState;
    private LocalDate recentAppointment;

}
