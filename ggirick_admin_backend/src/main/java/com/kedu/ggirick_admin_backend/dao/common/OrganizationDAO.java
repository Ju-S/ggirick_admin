package com.kedu.ggirick_admin_backend.dao.common;

import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrganizationDAO {
    private final SqlSessionTemplate mybatis;

    // 조직 등록 ( 직원 신규 등록시 )
    public int insertEmployeeOrganization(EmployeeDTO dto) {
        return mybatis.insert("Employee.insertEmployeeOrganization", dto);
    }
}
