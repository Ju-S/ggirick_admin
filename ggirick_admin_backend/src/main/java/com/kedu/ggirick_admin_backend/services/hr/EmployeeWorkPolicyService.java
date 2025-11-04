package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dto.hr.EmployeeWorkPolicyDAO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeWorkPolicyDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeWorkPolicyService {
    private  final EmployeeWorkPolicyDAO employeeWorkPolicyDAO;

    // 직원 한명 근무정책 상세정보
    public EmployeeWorkPolicyDTO getEmployeeWorkPolicyDetails(String employeeId) {
        return employeeWorkPolicyDAO.getEmployeeWorkPolicyDetails(employeeId);
    }
}
