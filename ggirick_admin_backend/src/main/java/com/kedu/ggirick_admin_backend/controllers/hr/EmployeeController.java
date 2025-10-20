package com.kedu.ggirick_admin_backend.controllers.hr;

import com.kedu.ggirick_admin_backend.dto.auth.UserTokenDTO;
import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
import com.kedu.ggirick_admin_backend.dto.employee.EmployeeRegisterResultDTO;
import com.kedu.ggirick_admin_backend.services.hr.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // 직원 등록
    @PostMapping
    public ResponseEntity<EmployeeRegisterResultDTO> insertEmployee(@RequestBody EmployeeDTO dto) {
        // 직원 등록 후 직원 정보 담아오기 ( 초기 비밀번호 안내용 )
        EmployeeRegisterResultDTO newEmployeeDTO = employeeService.insertEmployee(dto);

        return (newEmployeeDTO != null)
                ? ResponseEntity.ok(newEmployeeDTO)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    // 직원 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    // 직원 수정
    @PutMapping
    public ResponseEntity<EmployeeDTO> updateEmployee(@RequestBody EmployeeDTO dto) {
        EmployeeDTO updated = employeeService.updateEmployee(dto);
        return (updated != null)
                ? ResponseEntity.ok(updated)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    // 로그인한 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<EmployeeDTO> getMyInfo(@AuthenticationPrincipal UserTokenDTO userInfo) {
        System.out.println("토큰으로 정보 가져오기");
        String id = userInfo.getId();
        System.out.println("가져온 아이디 : " + id);
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        EmployeeDTO myInfo = employeeService.getEmployeeInfo(id);
        return ResponseEntity.ok(myInfo);
    }

    // 직원 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeDetail(@PathVariable String id) {
        EmployeeDTO dto = employeeService.getEmployeeInfo(id);
        return (dto != null)
                ? ResponseEntity.ok(dto)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    // 직원 목록 조회
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployeeList() {
        List<EmployeeDTO> list = employeeService.getAllEmployeeList();
        return ResponseEntity.ok(list);
    }

    // 비밀번호 변경
    @PutMapping("/password/{id}")
    public ResponseEntity<Void> updatePassword(@PathVariable String id, @RequestBody EmployeeDTO dto) {
        dto.setId(id);
        boolean success = employeeService.updatePassword(dto);
        return success ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
