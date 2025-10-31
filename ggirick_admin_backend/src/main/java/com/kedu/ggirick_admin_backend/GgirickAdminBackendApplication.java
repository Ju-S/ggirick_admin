package com.kedu.ggirick_admin_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
public class GgirickAdminBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GgirickAdminBackendApplication.class, args);
    }

}
