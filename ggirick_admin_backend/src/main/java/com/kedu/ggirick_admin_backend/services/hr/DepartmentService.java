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

    // 부서 목록 전체 조회 ( 메타 데이터 조회용 )
    public List<DepartmentDTO> getAllDepartments() {
        return departmentDAO.getAllDepartments();
    }

    // 부서 등록
    public boolean insertDepartment(DepartmentDTO dto) {
        // 부서 코드 중복 여부 확인
        if (departmentDAO.checkDuplicateDepartmentCode(dto.getCode()) > 0) {
            return false;
        }
        departmentDAO.insertDepartment(dto);
        return true;
    }

    // 부서 수정
    public void updateDepNameByCode(DepartmentDTO dto) {
        departmentDAO.updateDepNameByCode(dto);
    }

    // 부서 삭제
    public void deleteDepartmentByCode(String code) {
        departmentDAO.deleteDepartmentByCode(code);
    }
}
