package com.kedu.ggirick_admin_backend.dto.system;

import lombok.*;
import java.sql.Date;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkPolicyDTO {
    private Long policyId;           // 정책 PK
    private String departmentId;     // 부서 ID
    private String organizationId;   // 조직 ID
    private String policyName;       // 정책명
    private String workStartTime;    // 출근시간 (HH:mm)
    private String workEndTime;      // 퇴근시간 (HH:mm)
    private Date effectiveDate;      // 시행일
    private Timestamp changedAt;     // 변경일시
    private String changedBy;        // 변경자
    private String remark;           // 비고
}
