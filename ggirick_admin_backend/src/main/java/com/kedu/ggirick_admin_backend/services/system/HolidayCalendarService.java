package com.kedu.ggirick_admin_backend.services.system;

import com.kedu.ggirick_admin_backend.dao.system.HolidayCalendarDAO;
import com.kedu.ggirick_admin_backend.dto.system.HolidayCalendarDTO;
import com.kedu.ggirick_admin_backend.infrastructure.api.HolidayAPIClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class HolidayCalendarService {

    private final HolidayCalendarDAO holidayCalendarDAO;
    private final HolidayAPIClient holidayAPIClient;

    // 해당 날짜가 이미 존재하는지 확인
    public boolean exists(LocalDate date) {
        return holidayCalendarDAO.exists(date);
    }

    // 전체 목록 조회
    public List<HolidayCalendarDTO> getAll() {
        return holidayCalendarDAO.selectAll();
    }

    // 휴일 등록
    public boolean insert(HolidayCalendarDTO dto) {
        try {
            // 중복 방지
            if (exists(dto.getCalDate())) {
                log.info("이미 존재하는 날짜: {}", dto.getCalDate());
                return false;
            }

            holidayCalendarDAO.insert(dto);
            log.info("휴일 등록 완료: {}", dto.getCalDate());
            return true;

        } catch (Exception e) {
            log.error("휴일 등록 실패: {}", e.getMessage());
            return false;
        }
    }

    // 휴일 수정
    public boolean update(HolidayCalendarDTO dto) {
        try {
            holidayCalendarDAO.update(dto);
            log.info("휴일 수정 완료: {}", dto.getCalDate());
            return true;
        } catch (Exception e) {
            log.error("휴일 수정 실패: {}", e.getMessage());
            return false;
        }
    }

    // 휴일 삭제
    public boolean delete(Long id) {
        try {
            holidayCalendarDAO.delete(id);
            log.info("휴일 삭제 완료: {}", id);
            return true;
        } catch (Exception e) {
            log.error("휴일 삭제 실패: {}", e.getMessage());
            return false;
        }
    }

    // 공공데이터 기반 휴일 등록 로직
    // 외부 API 응답 데이터를 DB에 저장
    @Transactional
    protected int saveHolidayData(List<Map<String, Object>> holidays, int year) {
        int insertedCount = 0;

        for (Map<String, Object> h : holidays) {
            try {
                // API 응답에서 필요한 필드 추출
                String name = (String) h.get("dateName");
                String locdate = String.valueOf(h.get("locdate"));
                LocalDate date = LocalDate.parse(locdate, DateTimeFormatter.ofPattern("yyyyMMdd"));

                // 이미 존재하는 날짜는 skip
                if (exists(date)) {
                    log.debug("중복 skip: {} ({})", name, date);
                    continue;
                }

                // DTO 구성
                HolidayCalendarDTO dto = new HolidayCalendarDTO();
                dto.setCalDate(date);
                dto.setIsWorkday("N");
                dto.setDescription(name);
                dto.setHolidayType(name.contains("대체") ? "SUBSTITUTE" : "PUBLIC");

                // DB 저장
                holidayCalendarDAO.insert(dto);
                insertedCount++;
                log.info("공휴일 등록: {} ({})", name, date);

            } catch (Exception e) {
                log.warn("공휴일 데이터 처리 실패: {}", e.getMessage());
            }
        }

        log.info("{}년도 공휴일 등록 완료 — 총 {}건 신규 등록", year, insertedCount);
        return insertedCount;
    }

    // 올해 공휴일 수동 등록 (12개월 반복 호출)
    @Transactional
    public boolean registerCurrentYearHolidays() {
        int year = LocalDate.now().getYear();
        log.info("[수동등록] {}년도 공휴일 생성 시작", year);

        try {
            List<Map<String, Object>> allHolidays = new ArrayList<>();

            // 1~12월 반복 호출
            for (int month = 1; month <= 12; month++) {
                String formattedMonth = String.format("%02d", month);
                List<Map<String, Object>> monthly = holidayAPIClient.fetchHolidays(year, formattedMonth);

                if (monthly != null && !monthly.isEmpty()) {
                    allHolidays.addAll(monthly);
                    log.info("{}년 {}월 공휴일 {}건 수신", year, formattedMonth, monthly.size());
                } else {
                    log.debug("{}년 {}월 공휴일 없음", year, formattedMonth);
                }

                // API 서버 부하 방지를 위한 딜레이
                try { Thread.sleep(300); } catch (InterruptedException ignored) {}
            }

            if (allHolidays.isEmpty()) {
                log.warn("{}년도 공휴일 API 응답 비어있음", year);
                return false;
            }

            int inserted = saveHolidayData(allHolidays, year);
            return inserted > 0;

        } catch (Exception e) {
            log.error("공휴일 등록 중 오류 발생: {}", e.getMessage());
            return false;
        }
    }

    // 다음년도 공휴일 수동 등록
    @Transactional
    public boolean registerNextYearHolidays() {
        int nextYear = LocalDate.now().plusYears(1).getYear();
        log.info("[수동등록] {}년도 공휴일 생성 시작", nextYear);

        try {
            List<Map<String, Object>> allHolidays = new ArrayList<>();

            // 1~12월 반복 호출
            for (int month = 1; month <= 12; month++) {
                String formattedMonth = String.format("%02d", month);
                List<Map<String, Object>> monthly = holidayAPIClient.fetchHolidays(nextYear, formattedMonth);

                if (monthly != null && !monthly.isEmpty()) {
                    allHolidays.addAll(monthly);
                    log.info("{}년 {}월 공휴일 {}건 수신", nextYear, formattedMonth, monthly.size());
                } else {
                    log.debug("{}년 {}월 공휴일 없음", nextYear, formattedMonth);
                }

                // API 부하 방지를 위해 약간의 대기 (0.3초)
                try { Thread.sleep(300); } catch (InterruptedException ignored) {}
            }

            if (allHolidays.isEmpty()) {
                log.warn("{}년도 공휴일 API 응답 비어있음", nextYear);
                return false;
            }

            int inserted = saveHolidayData(allHolidays, nextYear);
            return inserted > 0;

        } catch (Exception e) {
            log.error("공휴일 등록 중 오류 발생: {}", e.getMessage());
            return false;
        }
    }

    // 특정 날짜가 휴일인지 확인
    public boolean isHoliday(Date date) {
        return holidayCalendarDAO.isHoliday(date);
    }
}
