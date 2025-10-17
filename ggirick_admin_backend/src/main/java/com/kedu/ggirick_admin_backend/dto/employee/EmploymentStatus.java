package com.kedu.ggirick_admin_backend.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmploymentStatus {
    private int seq;
    private String empId;
    private String employmentStatus;
    private Timestamp changeDate;
    private Timestamp regDate;
}
