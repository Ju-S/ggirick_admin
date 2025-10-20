package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.common.AuthorityDAO;
import com.kedu.ggirick_admin_backend.dto.common.AuthorityDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.kedu.ggirick_admin_backend.dao.common.DepartmentDAO;


import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final AuthorityDAO authorityDAO;

    // 부서 목록 조회 ( 메타 데이터 조회용 )
    public List<AuthorityDTO> getAllAuthorities() {
        return authorityDAO.getAllAuthorities();
    }

}
