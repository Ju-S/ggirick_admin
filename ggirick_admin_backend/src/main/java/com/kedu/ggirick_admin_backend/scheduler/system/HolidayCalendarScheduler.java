package com.kedu.ggirick_admin_backend.scheduler.system;

import com.kedu.ggirick_admin_backend.services.system.HolidayCalendarService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class HolidayCalendarScheduler {

    private final HolidayCalendarService holidayCalendarService;

    // 매년 12월 31일 00:00에 다음년도 공휴일 등록
    @Scheduled(cron = "0 0 0 31 12 *", zone = "Asia/Seoul")
    public void run() {
        log.info("🚀 Holiday Calendar 자동등록 스케줄러 시작");
        holidayCalendarService.registerNextYearHolidays();
    }
}
