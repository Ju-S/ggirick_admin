package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.hr.OrganizationDAO;
import com.kedu.ggirick_admin_backend.dto.hr.OrganizationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationDAO organizationDAO;

    // 조직 목록 조회 ( 메타 데이터 조회용 )
    public List<OrganizationDTO> getAllOrganizations() {
        return organizationDAO.getAllOrganizations();
    }

    // 조직 등록
    public boolean insertOrganization(OrganizationDTO dto) {
        // 조직 코드 중복 여부 확인
        if (organizationDAO.checkDuplicateOrganizationCode(dto.getCode()) > 0) {
            return false;
        }
        organizationDAO.insertOrganization(dto);
        return true;
    }

    // 조직 수정
    public void updateOrganizationNameByCode(OrganizationDTO dto) {
        organizationDAO.updateOrganizationNameByCode(dto);
    }

    // 조직 삭제
    public void deleteOrganizationByCode(String code) {
        organizationDAO.deleteOrganizationByCode(code);
    }

}
