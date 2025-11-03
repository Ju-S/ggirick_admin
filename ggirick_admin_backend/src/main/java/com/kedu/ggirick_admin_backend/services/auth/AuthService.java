package com.kedu.ggirick_admin_backend.services.auth;


import com.kedu.ggirick_admin_backend.dao.auth.AuthDAO;
import com.kedu.ggirick_admin_backend.dto.auth.UserTokenDTO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
import com.kedu.ggirick_admin_backend.services.hr.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthDAO authDAO;
    private final EmployeeService employeeService;
    private final PasswordEncoder passwordEncoder;

    // ID만 가져오기 - 로그인 기능에 사용
    public EmployeeDTO login(EmployeeDTO dto) {
        EmployeeDTO employeeDTO = employeeService.getById(dto);

        // ID, PW 비교
        if (employeeDTO != null && passwordEncoder.matches(dto.getPw(), employeeDTO.getPw())) {
            return employeeDTO;
        }
        return null;
    }

    public UserTokenDTO getTokenInfo(String id) {
        return authDAO.getTokenInfo(id);
    }

}
