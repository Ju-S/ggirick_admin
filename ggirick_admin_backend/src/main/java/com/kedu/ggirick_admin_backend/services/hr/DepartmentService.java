package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.hr.DepartmentDAO;
import com.kedu.ggirick_admin_backend.dto.hr.DepartmentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentDAO departmentDAO;

    // 부서 목록 조회 ( 메타 데이터 조회용 )
    public List<DepartmentDTO> getAllDepartments() {
        return departmentDAO.getAllDepartments();
    }
}
