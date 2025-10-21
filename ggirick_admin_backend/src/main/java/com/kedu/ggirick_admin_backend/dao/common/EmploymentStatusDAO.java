package com.kedu.ggirick_admin_backend.dao.common;

import com.kedu.ggirick_admin_backend.dto.common.DepartmentDTO;
import com.kedu.ggirick_admin_backend.dto.common.EmploymentStatusCodeDTO;
import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EmploymentStatusDAO {

    private final SqlSessionTemplate mybatis;

    // 재직 상태 목록 조회 ( 메타 데이터 조회용 )
    public List<EmploymentStatusCodeDTO> getAllEmploymentStatuses() {
        return mybatis.selectList("hr.employment_status.getAllEmploymentStatuses");
    }

    // ID로 재직 상태 수정
    public void updateEmploymentStatusById(EmployeeDTO dto) {
        mybatis.update("hr.employment_status.updateEmploymentStatusById", dto);
    }

}