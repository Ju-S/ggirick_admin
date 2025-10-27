package com.kedu.ggirick_admin_backend.scheduler.hr;

import com.kedu.ggirick_admin_backend.dao.hr.EmployeeDAO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
import com.kedu.ggirick_admin_backend.services.hr.VacationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

/**
 * 📅 VacationScheduler
 * 매일 자정 기준으로 근속연수 도달 직원 연차 자동 갱신
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class VacationScheduler {

    private final EmployeeDAO employeeDAO;
    private final VacationService vacationService;

    /**
     * 매일 자정(한국시간) 실행
     * cron = 초 분 시 일 월 요일
     * 0 0 0 * * *  → 매일 00:00:00
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void checkAnnualLeaveIncrease() {
        log.info("🕛 자정 휴가 자동 갱신 스케줄러 시작");

        List<EmployeeDTO> employeeList = employeeDAO.getAllEmployeeList();

        LocalDate today = LocalDate.now();
        for (EmployeeDTO emp : employeeList) {
            if (emp.getHireDate() == null) continue;

            LocalDate hireDate = emp.getHireDate().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();

            // 입사일이 오늘과 같은 월/일이라면 → 근속연수 1년 추가됨
            if (hireDate.getMonthValue() == today.getMonthValue() &&
                    hireDate.getDayOfMonth() == today.getDayOfMonth()) {

                log.info("🎉 {} 근속연차 갱신 대상", emp.getName());
                vacationService.registerAnnualLeaveByHireDate(emp.getId());
            }
        }

        log.info("✅ 휴가 자동 갱신 완료");
    }
}
