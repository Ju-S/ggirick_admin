package com.kedu.ggirick_admin_backend.services.system;

import com.kedu.ggirick_admin_backend.dao.system.WorkPolicyDAO;
import com.kedu.ggirick_admin_backend.dto.system.WorkPolicyDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class WorkPolicyService {

    private final WorkPolicyDAO workPolicyDAO;

    // 전체 정책 조회
    public List<WorkPolicyDTO> getAllPolicies() {
        List<WorkPolicyDTO> list = workPolicyDAO.selectAll();

        // 🔹 필요 시 Map 가공 (예: 부서별 정책 그룹화)
        // Map<String, List<WorkPolicyDTO>> grouped = list.stream()
        //     .collect(Collectors.groupingBy(WorkPolicyDTO::getDepartmentId));
        return list;
    }

    // 정책 등록
    public void insertPolicy(WorkPolicyDTO dto) {
        workPolicyDAO.insert(dto);
    }

    // 정책 수정
    public void updatePolicy(WorkPolicyDTO dto) {
        workPolicyDAO.update(dto);
    }

    // 정책 삭제
    public void deletePolicy(Long policyId) {
        workPolicyDAO.delete(policyId);
    }
}
