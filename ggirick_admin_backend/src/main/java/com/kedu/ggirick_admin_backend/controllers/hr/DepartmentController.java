package com.kedu.ggirick_admin_backend.controllers.hr;

import com.kedu.ggirick_admin_backend.dto.hr.DepartmentDTO;
import com.kedu.ggirick_admin_backend.services.hr.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/department")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    // 부서 등록
    @PostMapping
    public ResponseEntity<String> insertDepartment(@RequestBody DepartmentDTO dto) {
        boolean result = departmentService.insertDepartment(dto);
        if(result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409 중복 코드
    }

    // 부서 수정
    @PutMapping
    public ResponseEntity<String> updateDepNameByCode(@RequestBody DepartmentDTO dto) {
        departmentService.updateDepNameByCode(dto);
        return ResponseEntity.ok().build();
    }

    // 부서 삭제
    @DeleteMapping("/{departmentCode}")
    public ResponseEntity<String> deleteDepartmentByCode(@PathVariable("departmentCode") String code) {
        departmentService.deleteDepartmentByCode(code);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
