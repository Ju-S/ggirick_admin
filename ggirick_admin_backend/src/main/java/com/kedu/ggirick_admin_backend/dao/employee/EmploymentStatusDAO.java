package com.kedu.ggirick_admin_backend.dao.employee;

import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EmploymentStatusDAO {

    private final SqlSessionTemplate mybatis;

    // 재직 상태 등록 ( 직원 신규 등록시 )
    public int insertEmploymentStatus(String empId) {
        return mybatis.insert("Employee.insertEmploymentStatus", empId);
    }
}
