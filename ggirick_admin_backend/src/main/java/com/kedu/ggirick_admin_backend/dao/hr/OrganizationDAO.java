package com.kedu.ggirick_admin_backend.dao.hr;

import com.kedu.ggirick_admin_backend.dto.hr.OrganizationDTO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class OrganizationDAO {
    private final SqlSessionTemplate mybatis;

    // 조직 목록 조회 ( 메타 데이터 조회용 )
    public List<OrganizationDTO> getAllOrganizations() {
        return mybatis.selectList("Organization.getAllOrganizations");
    }

    // 조직 코드 -> 조직명 찾기
    public String findOrganizationName(String code) {
        return mybatis.selectOne("Organization.findOrganizationName", code);
    }

    // ID로 조직 수정
    public void updateEmployeeOrganizationById(EmployeeDTO dto) {
        mybatis.update("Organization.updateEmployeeOrganizationById", dto);
    }
}
