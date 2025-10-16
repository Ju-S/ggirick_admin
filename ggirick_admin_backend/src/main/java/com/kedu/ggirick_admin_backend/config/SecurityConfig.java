package com.kedu.ggirick_admin_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// 🔽 람다식 방식(AbstractHttpConfigurer)은 주석 처리해서 참고용으로 남김
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
// 🔽 아래 세 줄도 현재는 주석 처리 (중복 CORS 설정 방지용)
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // ✅ 전통적인 방식으로 수정 (.csrf().disable(), .cors().and() 등)
        http
                .cors() // 별도 CORSConfig.java에서 설정된 정책 사용
                .and()
                .csrf().disable() // CSRF 비활성화 (REST API용)
                .authorizeHttpRequests()
                .anyRequest().permitAll(); // 모든 요청 허용 (나중에 인증 추가 가능)

        return http.build();
    }

    /*
    // ❌ 비활성화: CORSConfig.java에서 이미 처리 중
    // 🔽 기존 람다식 기반의 CORS 설정 (참고용으로 남김)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); // 요청을 허용할 origin
        configuration.setAllowedMethods(List.of("*")); // 요청을 허용할 method(get/post/put/delete 등)
        configuration.setAllowedHeaders(List.of("*")); // 요청을 허용할 header
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    */

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCrypt 방식 암호화
    }
}
