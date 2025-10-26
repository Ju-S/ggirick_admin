package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.employee.EmploymentStatusDAO;
import com.kedu.ggirick_admin_backend.dto.hr.EmploymentStatusCodeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmploymentStatusService {
    private final EmploymentStatusDAO employmentStatusDAO;

    // 재직상태 목록 조회 ( 메타 데이터 조회용 )
    public List<EmploymentStatusCodeDTO> getAllEmploymentStatuses() {
        return employmentStatusDAO.getAllEmploymentStatuses();
    }
}
