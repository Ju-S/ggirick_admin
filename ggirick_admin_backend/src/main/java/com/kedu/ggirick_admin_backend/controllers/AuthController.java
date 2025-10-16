package com.kedu.ggirick_admin_backend.controllers;

import com.kedu.ggirick_admin_backend.dto.EmployeeDTO;
import com.kedu.ggirick_admin_backend.services.EmployeeService;
import com.kedu.ggirick_admin_backend.utils.JWTUtil;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final EmployeeService employeeService;
    private final JWTUtil jwt;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody EmployeeDTO loginInfo) {
        EmployeeDTO dto = employeeService.getById(loginInfo);
        if (dto != null) {
            // 인증 토큰 생성
            String token = jwt.createToken(dto.getId());
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
