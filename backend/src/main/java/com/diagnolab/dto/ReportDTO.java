package com.diagnolab.dto;

import com.diagnolab.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportDTO {

        private Long reportId;
        private String patientId;
        private String patientName;
        private String patientPhone;
        private User.Gender patientGender;
        private LocalDate patientDOB;
        private String completedAt;
        private String status;
        private List<ReportTestItemDTO> testResults;

}
