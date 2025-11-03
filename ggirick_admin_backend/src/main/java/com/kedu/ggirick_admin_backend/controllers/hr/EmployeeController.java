package com.kedu.ggirick_admin_backend.controllers.hr;

import com.kedu.ggirick_admin_backend.dto.auth.UserTokenDTO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeRegisterResultDTO;
import com.kedu.ggirick_admin_backend.services.hr.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        return ResponseEntity.ok(newEmployeeDTO);
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
        EmployeeDTO updateDTO = employeeService.updateEmployeeById(dto);
        return ResponseEntity.ok(updateDTO);
    }

    // 로그인한 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<EmployeeDTO> getMyInfo(@AuthenticationPrincipal UserTokenDTO userInfo) {
        System.out.println("토큰으로 정보 가져오기");
        String id = userInfo.getId();
        System.out.println("가져온 아이디 : " + id);

        EmployeeDTO myInfo = employeeService.getEmployeeInfo(id);
        return ResponseEntity.ok(myInfo);
    }

    // 직원 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeDetail(@PathVariable String id) {
        EmployeeDTO dto = employeeService.getEmployeeInfo(id);
        return ResponseEntity.ok(dto);
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
        employeeService.updatePassword(dto);
        return ResponseEntity.ok().build();
    }

    // 이메일 중복 체크
    @GetMapping("/duplcheck")
    public ResponseEntity<String> checkEmailDuplication(@RequestParam String email,
                                                        @AuthenticationPrincipal UserTokenDTO userInfo) {
        String errorMsg = null;
        if (employeeService.isEmailDuplicate(email, userInfo.getId())) {
            errorMsg = "존재하는 이메일입니다.";
        }

        if (errorMsg != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMsg);
        } else {
            return ResponseEntity.ok().build();
        }
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
