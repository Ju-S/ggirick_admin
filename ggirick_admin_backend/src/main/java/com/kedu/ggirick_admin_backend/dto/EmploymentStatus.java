package com.kedu.ggirick_admin_backend.dto;

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
    private String emp_id;
    private String employment_status;
    private Timestamp change_date;
    private Timestamp reg_date;
}
