package com.kedu.ggirick_admin_backend.dao.common;

import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AuthorityDAO {
    private final SqlSessionTemplate mybatis;

    // 권한 부여 ( 직원 신규 등록시 )
    public int insertEmployeeAuthority(EmployeeDTO dto) {
        return mybatis.insert("Employee.insertEmployeeAuthority", dto);
    }
}
