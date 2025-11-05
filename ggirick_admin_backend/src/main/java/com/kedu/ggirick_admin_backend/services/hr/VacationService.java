package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.hr.EmployeeDAO;
import com.kedu.ggirick_admin_backend.dao.hr.EmployeeVacationDAO;
import com.kedu.ggirick_admin_backend.dao.hr.VacationDAO;
import com.kedu.ggirick_admin_backend.dao.hr.VacationLogDAO;
import com.kedu.ggirick_admin_backend.dto.hr.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VacationService {

    private final VacationDAO vacationDAO;
    private final EmployeeDAO employeeDAO;
    private final EmployeeVacationDAO employeeVacationDAO;
    private final VacationLogDAO vacationLogDAO;

    // 입사시 or 입사일 수정시 - 입사일 기준으로 연차 생성
    @Transactional
    public void registerAnnualLeaveByHireDate(String employeeId) {
        EmployeeDTO employeeDTO = employeeDAO.getEmployeeInfo(employeeId);
        if (employeeDTO == null || employeeDTO.getHireDate() == null) {
            log.warn("직원 정보 또는 입사일이 없습니다. employeeId={}", employeeId);
            return;
        }

        log.info("[연차계산] 입사일 기준 자동 연차 생성 시작 - employeeId={}, hireDate={}",
                employeeId, employeeDTO.getHireDate());

        // DTO 준비 (세부 계산은 내부 메서드가 수행)
        AnnualLeaveGrantDTO dto = new AnnualLeaveGrantDTO();
        dto.setEmployeeId(employeeId);
        dto.setReason("입사일 기준 자동 부여");

        // 기존 연차 계산 및 등록 메서드 재활용
        boolean success = registerAnnualLeave(dto);

        if (success) {
            log.info("[연차계산] 입사일 기준 자동 부여 완료 - employeeId={}", employeeId);
        } else {
            log.warn("[연차계산] 연차 자동 부여 실패 - employeeId={}", employeeId);
        }
    }

    // 입사일 기준 연차 자동 계산 및 등록
    // 입사 1년 미만: 월 개근 1일씩
    // 입사 1년 이상: 15일 + 근속 2년마다 1일 추가 ( 최대 25일 )
    // 입사일 기준 잔여휴가 갱신
    @Transactional
    public boolean registerAnnualLeave(AnnualLeaveGrantDTO dto) {
        // 1. 직원 정보 조회
        EmployeeDTO employeeDTO = employeeDAO.getEmployeeInfo(dto.getEmployeeId());
        if (employeeDTO == null || employeeDTO.getHireDate() == null) {
            throw new IllegalArgumentException("직원 정보가 존재하지 않습니다.");
        }

        LocalDate hireDate = employeeDTO.getHireDate().toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDate();
        LocalDate today = LocalDate.now();

        // 2. 근속연수 계산
        long years = ChronoUnit.YEARS.between(hireDate, today);
        long months = ChronoUnit.MONTHS.between(hireDate, today);

        int daysGranted = 0;

        // 3. 연차 계산 로직
        if (years < 1) {
            // 입사 1년 미만 → 월 1일 (개근 기준)
            daysGranted = (int) Math.min(months, 11); // 최대 11개월
        } else {
            // 입사 1년 이상 → 15 + (근속 2년마다 +1)
            daysGranted = 15 + (int) ((years - 1) / 2);
            if (daysGranted > 25) {
                daysGranted = 25; // 최대 25일 제한
            }
        }

        // 4. DTO 데이터 세팅
        dto.setGrantDate(new Date());
        dto.setExpireDate(java.sql.Date.valueOf(today.plusYears(1)));
        dto.setDaysGranted(daysGranted);
        dto.setDaysUsed(0);
        dto.setReason("입사일 기준 자동 부여");

        // 5. DB 저장
        boolean inserted = vacationDAO.insertAnnualLeaveGrant(dto) > 0;

        if (inserted) {
            // 잔여 휴가 업데이트 (employee_vacation 테이블)
            employeeVacationDAO.updateRemaining(dto.getEmployeeId());
        }

        return inserted;
    }

    // 휴가 사용 기록 등록
    @Transactional
    public boolean registerVacationUsage(VacationUsageLogDTO dto) {
        // 1. 휴가 일수 계산
        LocalDate start = dto.getStartDate().toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDate();
        LocalDate end = dto.getEndDate().toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDate();
        int usedDays = (int) (ChronoUnit.DAYS.between(start, end) + 1);
        dto.setDaysUsed(usedDays);

        // 2. 사용 로그 insert
        boolean inserted = vacationDAO.insertVacationUsageLog(dto) > 0;

        // 3. 연차 부여 테이블 update
        if (inserted && dto.getGrantId() != null) {
            int currentUsed = vacationDAO.getUsedDays(dto.getGrantId());
            int newUsed = currentUsed + usedDays;
            vacationDAO.updateUsedDays(dto.getGrantId(), newUsed);
        }

        // 4. employee_vacation 동기화
        employeeVacationDAO.updateRemaining(dto.getEmployeeId());

        // 5. 기존 vacation_log에도 insert (UI/전자결재용)
        VacationLogDTO log = new VacationLogDTO();
        log.setEmployeeId(dto.getEmployeeId());
        log.setApprovalId(dto.getApprovalId());
        log.setStartDate(dto.getStartDate());
        log.setEndDate(dto.getEndDate());
        log.setDaysUsed(usedDays);
        log.setVacationType(dto.getVacationType());
        vacationLogDAO.insertVacationLog(log);

        return inserted;
    }

    // 휴가 사용 촉진 알림 등록
    @Transactional
    public boolean registerVacationNotification(VacationNotificationLogDTO dto) {
        return vacationDAO.insertVacationNotification(dto) > 0;
    }

    // 직원별 연차 목록 조회
    public List<AnnualLeaveGrantDTO> getAnnualLeaveByEmployee(String employeeId) {
        return vacationDAO.getAnnualLeaveByEmployee(employeeId);
    }

    // 잔여 휴가 계산
    public int getRemainingVacation(String employeeId) {
        return vacationDAO.getRemainingVacation(employeeId);
    }

    // 휴가 결재 취소시 휴가 복구
    @Transactional
    public boolean cancelVacationUsage(Long usageId) {
        VacationUsageLogDTO usageLog = vacationDAO.getVacationUsageById(usageId);
        if (usageLog == null) throw new IllegalArgumentException("휴가 기록 없음");

        Long grantId = usageLog.getGrantId();
        int usedDays = usageLog.getDaysUsed();

        int currentUsed = vacationDAO.getUsedDays(grantId);
        int newUsed = Math.max(currentUsed - usedDays, 0);
        vacationDAO.updateUsedDays(grantId, newUsed);

        vacationDAO.deleteVacationUsage(usageId);
        employeeVacationDAO.updateRemaining(usageLog.getEmployeeId());
        vacationLogDAO.deleteVacationLog(usageId);

        return true;
    }
}
