//package com.kedu.ggirick_admin_backend.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CORSConfig implements WebMvcConfigurer {
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOriginPatterns( // 패턴 기반으로 여러 개발 포트 허용
//                        "http://10.5.5.8:*",
//                        "http://localhost:*",
//                        "http://92.168.219.110:*"
//                )
////                .allowedOrigins("http://10.5.5.8:5728", "http://localhost:5728")
//                .allowedMethods("*")
//                .allowedHeaders("*")
//                .allowCredentials(true)
//                .maxAge(3600);
//    }
//}
