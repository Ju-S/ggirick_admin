package com.kedu.ggirick_admin_backend.services.system;

import com.kedu.ggirick_admin_backend.dao.system.HolidayCalendarDAO;
import com.kedu.ggirick_admin_backend.dto.system.HolidayCalendarDTO;
import com.kedu.ggirick_admin_backend.infrastructure.api.HolidayAPIClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class HolidayCalendarService {

    private final HolidayCalendarDAO holidayCalendarDAO;
    private final HolidayAPIClient holidayAPIClient;

    @Transactional
    public void generateNextYearCalendar() {
        int nextYear = LocalDate.now().plusYears(1).getYear();
        log.info("🎯 {}년도 공휴일 캘린더 생성 시작", nextYear);

        List<Map<String, Object>> holidays = holidayAPIClient.fetchHolidays(nextYear);

        for (Map<String, Object> h : holidays) {
            try {
                String name = (String) h.get("dateName");
                String locdate = String.valueOf(h.get("locdate"));
                LocalDate date = LocalDate.parse(locdate, DateTimeFormatter.ofPattern("yyyyMMdd"));

                if (!holidayCalendarDAO.exists(date)) {
                    HolidayCalendarDTO dto = new HolidayCalendarDTO();
                    dto.setCalDate(date);
                    dto.setIsWorkday("N");
                    dto.setDescription(name);

                    if (name.contains("대체")) {
                        dto.setHolidayType("SUBSTITUTE");
                    } else {
                        dto.setHolidayType("PUBLIC");
                    }

                    holidayCalendarDAO.insert(dto);
                    log.info("✅ 등록: {} ({})", name, date);
                }
            } catch (Exception e) {
                log.warn("⚠️ 공휴일 데이터 처리 실패: {}", e.getMessage());
            }
        }

        log.info("🎉 {}년도 공휴일 등록 완료 ({}건)", nextYear, holidays.size());
    }
}
