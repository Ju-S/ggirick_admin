package com.kedu.ggirick_admin_backend.dao.employee;

import com.kedu.ggirick_admin_backend.dto.hr.EmploymentStatusCodeDTO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
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
        return mybatis.selectList("Employment_status.getAllEmploymentStatuses");
    }

    // ID로 재직 상태 수정
    public void updateEmploymentStatusById(EmployeeDTO dto) {
        mybatis.update("Employment_status.updateEmploymentStatusById", dto);
    }

}