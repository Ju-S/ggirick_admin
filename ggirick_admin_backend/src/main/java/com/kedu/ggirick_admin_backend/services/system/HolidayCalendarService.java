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

    // 공휴일 데이터를 DB에 저장 (트랜잭션 내)
    @Transactional
    protected void saveHolidayData(List<Map<String, Object>> holidays, int year) {
        for (Map<String, Object> h : holidays) {
            try {
                // API 응답에서 필요한 필드 꺼내기
                String name = (String) h.get("dateName");
                String locdate = String.valueOf(h.get("locdate"));
                LocalDate date = LocalDate.parse(locdate, DateTimeFormatter.ofPattern("yyyyMMdd"));

                // 이미 존재하는 날짜는 skip
                if (holidayCalendarDAO.exists(date)) continue;

                // DTO 구성
                HolidayCalendarDTO dto = new HolidayCalendarDTO();
                dto.setCalDate(date);
                dto.setIsWorkday("N");
                dto.setDescription(name);
                dto.setHolidayType(name.contains("대체") ? "SUBSTITUTE" : "PUBLIC");

                // ✅ DAO 호출 → Mapper → DB INSERT
                holidayCalendarDAO.insert(dto);
                log.info("✅ 등록: {} ({})", name, date);

            } catch (Exception e) {
                log.warn("⚠️ 공휴일 데이터 처리 실패: {}", e.getMessage());
            }
        }

        log.info("🎉 {}년도 공휴일 등록 완료 ({}건)", year, holidays.size());
    }

    // 다음년도 공휴일 자동 등록
    public void generateNextYearCalendar() {
        int nextYear = LocalDate.now().plusYears(1).getYear();
        log.info("🎯 {}년도 공휴일 캘린더 생성 시작", nextYear);

        List<Map<String, Object>> holidays = holidayAPIClient.fetchHolidays(nextYear);
        if (holidays.isEmpty()) {
            log.warn("❌ {}년도 공휴일 API 응답이 비어있음", nextYear);
            return;
        }

        // DAO 저장 메서드 호출
        saveHolidayData(holidays, nextYear);
    }

    // 올해 공휴일 수동 등록
    public void generateCurrentYearCalendar() {
        int currentYear = LocalDate.now().getYear();
        log.info("🎯 {}년도 공휴일 캘린더 생성 시작", currentYear);

        List<Map<String, Object>> holidays = holidayAPIClient.fetchHolidays(currentYear);
        if (holidays.isEmpty()) {
            log.warn("❌ {}년도 공휴일 API 응답이 비어있음", currentYear);
            return;
        }

        saveHolidayData(holidays, currentYear);
    }
}