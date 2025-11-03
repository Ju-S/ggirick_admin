package com.kedu.ggirick_admin_backend.controllers.system;

import com.kedu.ggirick_admin_backend.dto.system.HolidayCalendarDTO;
import com.kedu.ggirick_admin_backend.services.system.HolidayCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/holiday")
@RequiredArgsConstructor
public class HolidayCalendarController {

    private final HolidayCalendarService holidayCalendarService;

    // 내년 공휴일 자동 등록
    @PostMapping("/generate-next-year")
    public String generateNextYear() {
        holidayCalendarService.registerNextYearHolidays();
        return "내년도 공휴일 등록 완료";
    }

    // 올해 공휴일 등록 (처음 세팅용)
    @PostMapping("/generate-current-year")
    public String generateCurrentYear() {
        holidayCalendarService.registerCurrentYearHolidays();
        return "올해 공휴일 등록 완료";
    }

    // 전체 목록
    @GetMapping
    public ResponseEntity<List<HolidayCalendarDTO>> getAll() {
        return ResponseEntity.ok(holidayCalendarService.getAll());
    }

    // 등록
    @PostMapping
    public ResponseEntity<String> insert(@RequestBody HolidayCalendarDTO dto) {
        holidayCalendarService.insert(dto);
        return ResponseEntity.ok("공휴일이 등록되었습니다.");
    }

    // 수정
    @PutMapping
    public ResponseEntity<String> update(@RequestBody HolidayCalendarDTO dto) {
        holidayCalendarService.update(dto);
        return ResponseEntity.ok("공휴일이 수정되었습니다.");
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        holidayCalendarService.delete(id);
        return ResponseEntity.ok("공휴일이 삭제되었습니다.");
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
