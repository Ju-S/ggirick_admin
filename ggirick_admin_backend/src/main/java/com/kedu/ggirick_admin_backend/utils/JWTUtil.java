package com.kedu.ggirick_admin_backend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTUtil {

    @Value("${jwt.expiration}")
    private Long exp;

    private final Algorithm algorithm;
    private final JWTVerifier jwt;

    public JWTUtil(@Value("${jwt.secret}") String secret) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.jwt = JWT.require(algorithm).build();
    }

    // String ID 버전
    public String createToken(String id) {
        return JWT.create()
                .withSubject(id) // JWT의 subject에 id 저장
                .withClaim("id", id)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + exp))
                .sign(algorithm);
    }

    // int ID 버전 (오버로딩)
    public String createToken(int id) {
        return createToken(String.valueOf(id)); // int → String 변환 후 재활용
    }

    // 토큰 검증 및 복호화
    public DecodedJWT verifyToken(String token) {
        return jwt.verify(token);
    }
}
