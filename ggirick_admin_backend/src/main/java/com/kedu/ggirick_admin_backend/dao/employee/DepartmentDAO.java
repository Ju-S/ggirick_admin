package com.kedu.ggirick_admin_backend.dao.employee;

import com.kedu.ggirick_admin_backend.dto.hr.DepartmentDTO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class DepartmentDAO {
    private final SqlSessionTemplate mybatis;

    // 부서 목록 조회 ( 메타 데이터 조회용 )
    public List<DepartmentDTO> getAllDepartments() {
        return mybatis.selectList("Department.getAllDepartments");
    }

    // 부서 코드 -> 부서명 찾기
    public String findDepartmentName(String code) {
        return mybatis.selectOne("Department.findDepartmentName", code);
    }

    // ID로 부서 수정
    public void updateEmployeeDepartmentById(EmployeeDTO dto) {
        mybatis.update("Department.updateEmployeeDepartmentById", dto);
    }
}
