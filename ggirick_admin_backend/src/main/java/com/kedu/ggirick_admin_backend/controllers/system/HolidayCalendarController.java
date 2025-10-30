package com.kedu.ggirick_admin_backend.controllers.system;

import com.kedu.ggirick_admin_backend.services.system.HolidayCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/system/holiday")
@RequiredArgsConstructor
public class HolidayCalendarController {

    private final HolidayCalendarService holidayCalendarService;

    // ✅ 내년 공휴일 자동 등록
    @PostMapping("/generate-next-year")
    public String generateNextYear() {
        holidayCalendarService.generateNextYearCalendar();
        return "✅ 내년도 공휴일 등록 완료";
    }

    // ✅ 올해 공휴일 등록 (처음 세팅용)
    @PostMapping("/generate-current-year")
    public String generateCurrentYear() {
        holidayCalendarService.generateCurrentYearCalendar();
        return "✅ 올해 공휴일 등록 완료";
    }
}
