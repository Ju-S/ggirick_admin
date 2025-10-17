package com.kedu.ggirick_admin_backend.dao.auth;
import com.kedu.ggirick_admin_backend.dto.auth.UserTokenDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AuthDAO {
    private final SqlSessionTemplate mybatis;

    public UserTokenDTO getTokenInfo(String id) {
        return mybatis.selectOne("Token.getTokenInfo", id);
    }
}
