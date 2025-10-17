package com.kedu.ggirick_admin_backend.dao.common;

import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class JobDAO {
    private final SqlSessionTemplate mybatis;

    // 직급 등록 ( 직원 신규 등록시 )
    public int insertEmployeeJob(EmployeeDTO dto) {
        return mybatis.insert("Employee.insertEmployeeJob", dto);
    }

    // ID로 직급 조회
    public String getJobCodeById(String empId) {
        return mybatis.selectOne("Job.getJobCodeById", empId);
    }
}
