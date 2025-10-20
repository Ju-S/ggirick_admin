package com.kedu.ggirick_admin_backend.dao.common;

import com.kedu.ggirick_admin_backend.dto.common.AuthorityDTO;
import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AuthorityDAO {
    private final SqlSessionTemplate mybatis;

    // 권한 목록 조회 ( 메타 데이터 조회용 )
    public List<AuthorityDTO> getAllAuthorities() {
        return mybatis.selectList("hr.authority.getAllAuthorities");
    }
}
