package com.kedu.ggirick_admin_backend.dto.hr;

import lombok.Data;

@Data
public class EmployeeRegisterResultDTO {
    private String name;
    private String departmentName;
    private String jobName;
    private String organizationName;
    private String empId;
    private String tempPw;
}

