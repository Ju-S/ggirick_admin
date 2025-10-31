package com.kedu.ggirick_admin_backend.services.auth;


import com.kedu.ggirick_admin_backend.dao.auth.AuthDAO;
import com.kedu.ggirick_admin_backend.dto.auth.UserTokenDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthDAO authDAO;

    public UserTokenDTO getTokenInfo(String id) {
        return authDAO.getTokenInfo(id);
    }
}
