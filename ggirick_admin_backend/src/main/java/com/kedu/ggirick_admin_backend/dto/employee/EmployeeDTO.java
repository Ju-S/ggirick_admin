package com.kedu.ggirick_admin_backend.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String extension;
    private String email;
    private String profileUrl;

    // 아래 3개는 테이블 FK용 임시 필드 - 등록시에 사용
    private String deptCode;  // 부서코드
    private String orgCode;   // 조직코드
    private String jobCode;   // 직급코드
}
