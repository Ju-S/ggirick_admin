package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.hr.DepartmentDAO;
import com.kedu.ggirick_admin_backend.dao.hr.EmploymentStatusDAO;
import com.kedu.ggirick_admin_backend.dao.hr.JobDAO;
import com.kedu.ggirick_admin_backend.dao.hr.OrganizationDAO;
import com.kedu.ggirick_admin_backend.dao.hr.EmployeeDAO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeRegisterResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeDAO employeeDAO;
    private final DepartmentDAO departmentDAO;
    private final JobDAO jobDAO;
    private final OrganizationDAO organizationDAO;
    private final EmploymentStatusDAO employmentStatusDAO;
    private final VacationService vacationService;

    private final PasswordEncoder passwordEncoder;

    // ID만 가져오기 - 로그인 기능에 사용
    public EmployeeDTO login(EmployeeDTO dto) {
        EmployeeDTO employeeDTO = employeeDAO.getById(dto);

        // ID, PW 비교
        if (employeeDTO != null && passwordEncoder.matches(dto.getPw(), employeeDTO.getPw())) {
            return employeeDTO;
        }
        return null;
    }

    // 직원 등록
    @Transactional // 트랜잭션 묶기
    public EmployeeRegisterResultDTO insertEmployee(EmployeeDTO dto) {
        // 1. 사원번호 자동 생성
        String empId = createEmployeeId();
        dto.setId(empId); // dto에 id 담기
        System.out.println("사원번호 : " + dto.getId());

        // 2. 초기 비밀번호 랜덤(UUID 기반)
        String tempPw = UUID.randomUUID().toString().substring(0, 8); // 8자리만 사용
        String encodedPw = passwordEncoder.encode(tempPw);
        dto.setPw(encodedPw);

        // 임시 프로필 url
        String encodedName = URLEncoder.encode(dto.getName(), StandardCharsets.UTF_8); // 한글깨짐, 공백 방지
        // 프로필 랜덤 색 생성
        String[] colors = {"14b8a6", "3b82f6", "ef4444", "8b5cf6", "f97316"};
        String randomColor = colors[new Random().nextInt(colors.length)];
        dto.setProfileUrl("https://ui-avatars.com/api/?name=" + encodedName + "&background=" + randomColor + "&color=fff&size=128");

        // 직원 등록 관련 테이블 insert - 부서, 조직, 권한, 재직상태, 비밀번호 초기화 상태
        Boolean isInsertEmployee = employeeDAO.insertEmployee(dto) > 0;
        Boolean isInsertEmployeeDepartment = employeeDAO.insertEmployeeDepartment(dto) > 0;
        Boolean isInsertEmploymentStatus = employeeDAO.insertEmploymentStatus(dto.getId()) > 0;
        Boolean isInsertEmployeeJob = employeeDAO.insertEmployeeJob(dto) > 0;
        Boolean isInsertEmployeeOrganization = employeeDAO.insertEmployeeOrganization(dto) > 0;
        Boolean isInsertEmployeeAuthority = employeeDAO.insertEmployeeAuthority(dto) > 0;
        Boolean isInsertPwReset = employeeDAO.insertPasswordReset(dto.getId()) > 0;

        // 전부 입력 성공시
        if (isInsertEmployee && isInsertEmployeeDepartment
                && isInsertEmploymentStatus && isInsertEmployeeJob
                && isInsertEmployeeOrganization && isInsertEmployeeAuthority
                && isInsertPwReset) {

            // 신규 직원 연차 자동 생성
            vacationService.registerAnnualLeaveByHireDate(dto.getId());

            // 새로 등록된 직원 정보 조회 - 안내용
            EmployeeRegisterResultDTO newDTO = new EmployeeRegisterResultDTO();
            newDTO.setEmpId(empId); // 사원번호
            newDTO.setName(dto.getName()); // 이름

            // departmentCode, jobCode, organizationCode → 이름으로 변환 (DAO 통해 조회)
            String deptName = departmentDAO.findDepartmentName(dto.getDepartmentCode());
            String jobName = jobDAO.findJobName(dto.getJobCode());
            String orgName = organizationDAO.findOrganizationName(dto.getOrganizationCode());

            newDTO.setDepartmentName(deptName); // 부서명
            newDTO.setJobName(jobName); // 직급명
            newDTO.setOrganizationName(orgName); // 조직명
            newDTO.setTempPw(tempPw); // 초기비밀번호

            return newDTO;
        } else {
            System.err.println("❌ 직원 등록 실패");
            return null;
        }
    }

    // 사원 삭제
    public void deleteEmployee(String id) {
        employeeDAO.deleteEmployeeById(id);
    }

    // 사원 정보 수정
    @Transactional
    public EmployeeDTO updateEmployeeById(EmployeeDTO dto) {
        // 1️⃣ 기존 DB 값 조회 (조인된 hireDate 포함)
        EmployeeDTO beforeEmployee = employeeDAO.getEmployeeInfo(dto.getId());
        if (beforeEmployee == null) {
            throw new IllegalArgumentException("해당 사원을 찾을 수 없습니다: " + dto.getId());
        }

        // 2️⃣ 직급 비교
        String currentJobCode = jobDAO.getJobCodeById(dto.getId());
        dto.setJobChanged(!Objects.equals(currentJobCode, dto.getJobCode()));

        // 3️⃣ 입사일 변경 여부 비교 (hireDate vs reg_date)
        boolean hireDateChanged = false;
        if (beforeEmployee.getHireDate() != null && dto.getHireDate() != null) {
            hireDateChanged = !beforeEmployee.getHireDate().equals(dto.getHireDate());
        }

        System.out.println("before: " + beforeEmployee.getHireDate());
        System.out.println("after: " + dto.getHireDate());
        System.out.println("equals? " + beforeEmployee.getHireDate().equals(dto.getHireDate()));

        // 4️⃣ 기본 인적/부서/직급/조직/재직 상태 업데이트
        employeeDAO.updateEmployeeById(dto);
        departmentDAO.updateEmployeeDepartmentById(dto);
        jobDAO.updateEmployeeJobById(dto);
        organizationDAO.updateEmployeeOrganizationById(dto);
        employmentStatusDAO.updateEmploymentStatusById(dto); // ← 여기서 reg_date 업데이트됨

        // 5️⃣ 입사일이 바뀌었을 때만 휴가 자동 재계산
        if (hireDateChanged) {
            vacationService.registerAnnualLeaveByHireDate(dto.getId());
            System.out.println("✅ 입사일 변경 감지: " + dto.getHireDate() + " → 휴가 자동 재계산 완료");
        }

        // 다시 DB에서 조회해서 리턴
        return employeeDAO.getEmployeeInfo(dto.getId());
    }

    // 사원 한명 정보
    public EmployeeDTO getEmployeeInfo(String id) {
        return employeeDAO.getEmployeeInfo(id);
    }

    // 직원 전체 목록
    public List<EmployeeDTO> getAllEmployeeList() {
        return employeeDAO.getAllEmployeeList();
    }

    // 비밀번호 변경
    public boolean updatePassword(EmployeeDTO dto) {
        // 암호화 후 DB 저장
        dto.setPw(passwordEncoder.encode(dto.getPw()));
        return employeeDAO.updatePassword(dto);
    }

    // 사원번호 자동 생성
    private String createEmployeeId() {
        // 현재 연도 끝 두 자리
        String year = String.valueOf(java.time.Year.now().getValue()).substring(2);

        // DB에서 해당 연도 마지막 사번 조회
        String lastEmpId = employeeDAO.getLastEmployeeId(year);

        int nextSeq = 1; // 기본값
        if (lastEmpId != null && lastEmpId.length() == 8) {
            // 뒤의 4자리 숫자 추출 → +1
            String uniqueNumber = lastEmpId.substring(4);
            nextSeq = Integer.parseInt(uniqueNumber) + 1;
        }

        // 사번 조합: 10 + YY + 4자리 시퀀스 / %s: 문자열 자리, %04d : 4자리 정수(빈자리 0으로 채움)
        return String.format("10%s%04d", year, nextSeq);
    }

}
