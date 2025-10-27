package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.hr.EmployeeDAO;
import com.kedu.ggirick_admin_backend.dao.hr.EmployeeVacationDAO;
import com.kedu.ggirick_admin_backend.dao.hr.VacationDAO;
import com.kedu.ggirick_admin_backend.dao.hr.VacationLogDAO;
import com.kedu.ggirick_admin_backend.dto.hr.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VacationService {

    private final VacationDAO vacationDAO;
    private final EmployeeDAO employeeDAO;
    private final EmployeeVacationDAO employeeVacationDAO;
    private final VacationLogDAO vacationLogDAO;

    // 직원 등록시 입사일 기준으로 기준 연차 자동 계산 및 등록
    @Transactional
    public void registerAnnualLeaveByHireDate(String employeeId) {
        EmployeeDTO employeeDTO = employeeDAO.getEmployeeInfo(employeeId);
        if (employeeDTO == null) return;

        // AnnualLeaveGrantDTO를 만들어서 기존 메서드 재활용
        AnnualLeaveGrantDTO dto = new AnnualLeaveGrantDTO();
        dto.setEmployeeId(employeeId);

        registerAnnualLeave(dto); // 기존 메서드 호출 (로직 중복 방지)

        employeeVacationDAO.updateRemaining(employeeId); // 잔여 휴가 갱신
    }

    // 입사일 기준 연차 자동 계산 및 등록
    // 입사 1년 미만: 월 개근 1일씩
    // 입사 1년 이상: 15일 + 근속 2년마다 1일 추가 ( 최대 25일 )
    @Transactional
    public boolean registerAnnualLeave(AnnualLeaveGrantDTO dto) {
        // 1️⃣ 직원 정보 조회
        EmployeeDTO employeeDTO = employeeDAO.getEmployeeInfo(dto.getEmployeeId());
        if (employeeDTO == null || employeeDTO.getHireDate() == null) {
            throw new IllegalArgumentException("직원 정보가 존재하지 않습니다.");
        }

        LocalDate hireDate = employeeDTO.getHireDate().toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDate();
        LocalDate today = LocalDate.now();

        // 2️⃣ 근속년수 계산
        long years = ChronoUnit.YEARS.between(hireDate, today);
        long months = ChronoUnit.MONTHS.between(hireDate, today);

        int daysGranted = 0;

        // 3️⃣ 연차 계산 로직
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

        // 4️⃣ DTO 데이터 세팅
        dto.setGrantDate(new Date());
        dto.setExpireDate(java.sql.Date.valueOf(today.plusYears(1)));
        dto.setDaysGranted(daysGranted);
        dto.setDaysUsed(0);
        dto.setReason("입사일 기준 자동 부여");

        // 5️⃣ DB 저장
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
        // 1️⃣ 휴가 일수 계산
        LocalDate start = dto.getStartDate().toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDate();
        LocalDate end = dto.getEndDate().toInstant()
                .atZone(java.time.ZoneId.systemDefault())
                .toLocalDate();
        int usedDays = (int) (ChronoUnit.DAYS.between(start, end) + 1);
        dto.setDaysUsed(usedDays);

        // 2️⃣ 사용 로그 insert
        boolean inserted = vacationDAO.insertVacationUsageLog(dto) > 0;

        // 3️⃣ 연차 부여 테이블 update
        if (inserted && dto.getGrantId() != null) {
            int currentUsed = vacationDAO.getUsedDays(dto.getGrantId());
            int newUsed = currentUsed + usedDays;
            vacationDAO.updateUsedDays(dto.getGrantId(), newUsed);
        }

        // 4️⃣ employee_vacation 동기화
        employeeVacationDAO.updateRemaining(dto.getEmployeeId());

        // 5️⃣ 기존 vacation_log에도 insert (UI/전자결재용)
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
