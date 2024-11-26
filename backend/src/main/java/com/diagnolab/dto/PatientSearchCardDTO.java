package com.diagnolab.dto;

import com.diagnolab.entity.user.User.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientSearchCardDTO {
    private String patientId;
    private String firstName;
    private String lastName;
    private Gender gender;
    private String dateOfBirth;
    private String phoneNumber;
    private String nic;

}