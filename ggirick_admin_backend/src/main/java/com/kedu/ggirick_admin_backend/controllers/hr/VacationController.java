package com.kedu.ggirick_admin_backend.controllers.hr;

import com.kedu.ggirick_admin_backend.dto.hr.AnnualLeaveGrantDTO;
import com.kedu.ggirick_admin_backend.dto.hr.VacationUsageLogDTO;
import com.kedu.ggirick_admin_backend.services.hr.VacationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vacation")
@RequiredArgsConstructor
public class VacationController {

    private final VacationService vacationService;

    // 연차 부여 등록 (관리자 수동 등록 or 자동 생성 시 사용)
    @PostMapping("/grant")
    public ResponseEntity<Void> insertAnnualLeave(@RequestBody AnnualLeaveGrantDTO dto) {
        vacationService.registerAnnualLeave(dto);
        return ResponseEntity.ok().build();
    }

    // 휴가 사용 등록 (전자결재 승인 시 자동 호출)
    @PostMapping("/usage")
    public ResponseEntity<Void> insertVacationUsage(@RequestBody VacationUsageLogDTO dto) {
        vacationService.registerVacationUsage(dto);
        return ResponseEntity.ok().build();
    }

    // 직원별 연차 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<AnnualLeaveGrantDTO>> getAnnualLeaveList(@RequestParam String employeeId) {
        List<AnnualLeaveGrantDTO> list = vacationService.getAnnualLeaveByEmployee(employeeId);
        return ResponseEntity.ok(list);
    }

    // 잔여 휴가 조회
    @GetMapping("/remaining")
    public ResponseEntity<Integer> getRemainingVacation(@RequestParam String employeeId) {
        int remaining = vacationService.getRemainingVacation(employeeId);
        return ResponseEntity.ok(remaining);
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
