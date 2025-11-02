package com.kedu.ggirick_admin_backend.controllers.hr;

import com.kedu.ggirick_admin_backend.dto.hr.JobDTO;
import com.kedu.ggirick_admin_backend.dto.hr.OrganizationDTO;
import com.kedu.ggirick_admin_backend.services.hr.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    // 조직 등록
    @PostMapping
    public ResponseEntity<String> insertOrganization(@RequestBody OrganizationDTO  dto) {
        boolean result = organizationService.insertOrganization(dto);
        if (result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409 중복 코드
    }

    // 조직 수정
    @PutMapping
    public ResponseEntity<String> updateOrganizationNameByCode(@RequestBody OrganizationDTO dto) {
        organizationService.updateOrganizationNameByCode(dto);
        return ResponseEntity.ok().build();
    }

    // 조직 삭제
    @DeleteMapping("/{orgCode}")
    public ResponseEntity<String> deleteOrganizationByCode(@PathVariable("orgCode") String code) {
        organizationService.deleteOrganizationByCode(code);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}

