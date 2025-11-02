package com.kedu.ggirick_admin_backend.dto.hr;

import lombok.*;
import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeWorkPolicyDTO {
    private String employeeId;       // 직원 ID
    private Long policyId;           // 정책 ID
    private Date regDate;            // 등록일
    private Date changeDate;         // 변경일

    // JOIN 결과용
    private String employeeName;     // 직원 이름
    private String departmentName;   // 직원 부서명
    private String jobName;          // 직급
    private String organizationName; // 조직명
    private String policyName;       // 적용중인 정책명
    private String policyRemark;       // 적용중인 정책명 - 비고
    private String workStartTime;    // 출근시간
    private String workEndTime;      // 퇴근시간
}
