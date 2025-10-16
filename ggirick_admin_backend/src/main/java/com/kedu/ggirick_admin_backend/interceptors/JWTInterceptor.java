package com.kedu.ggirick_admin_backend.interceptors;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.kedu.ggirick_admin_backend.utils.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class JWTInterceptor implements HandlerInterceptor {

    private final JWTUtil jwt;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String authHeader = request.getHeader("Authorization");

        // ✅ 1️⃣ 토큰이 아예 없거나, null/빈 문자열이면 그냥 통과
        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.equals("Bearer null")) {
            System.out.println("⚠️ JWT 없음 또는 유효하지 않음 → 인증 검사 생략");
            return true; // 로그인 전 단계라 통과시킴
        }

        // ✅ 2️⃣ "Bearer " 이후의 실제 토큰 값만 추출
        String token = authHeader.substring(7);

        try {
            // ✅ 3️⃣ 토큰 유효성 검증
            DecodedJWT djwt = jwt.verifyToken(token);
            request.setAttribute("loginID", djwt.getSubject());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token Error");
            return false;
        }
    }

        //        String path = request.getRequestURI();
//
//        // ✅ 인증 예외 처리할 경로들 (로그인, 사원등록, 테스트용 등)
//        if (path.startsWith("/auth") ||
//                path.startsWith("/employee") && request.getMethod().equals("POST")) {
//            return true; // 로그인 없이 접근 허용
//        }
//
//        // 나중엔 url 별로 어떤 url은 인터셉트하고 어떤 url은 인터셉트 안 할건지 지정
//        String authHeader = request.getHeader("Authorization");
//
//        if(authHeader != null) {
//            String token = authHeader.substring(7);
//
//            try {
//                DecodedJWT djwt = jwt.verifyToken(token);
//                // 인터셉터에서 미리 ID를 꺼내서 넘겨주는게 편함. - 가장 많이 사용하는 정보
//                 request.setAttribute("loginId", djwt.getSubject());
//                return true;
//            }catch (Exception e){ // 인증 실패시
//                e.printStackTrace();
//                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token Error");
//                return false;
//            }
//        } else {
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token Error");
//            return false;
//        }
    }

