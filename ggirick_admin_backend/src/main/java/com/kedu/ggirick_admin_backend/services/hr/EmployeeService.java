package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.common.DepartmentDAO;
import com.kedu.ggirick_admin_backend.dao.common.JobDAO;
import com.kedu.ggirick_admin_backend.dao.common.OrganizationDAO;
import com.kedu.ggirick_admin_backend.dao.employee.EmployeeDAO;
import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
import com.kedu.ggirick_admin_backend.dto.employee.EmployeeRegisterResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeDAO employeeDAO;
    private final DepartmentDAO departmentDAO;
    private final JobDAO jobDAO;
    private final OrganizationDAO organizationDAO;

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
        System.out.println("🟢 [1] insertEmployee 진입");
        System.out.println("   id=" + dto.getId());
        System.out.println("   name=" + dto.getName());
        System.out.println("   deptCode=" + dto.getDepartmentCode());
        System.out.println("   jobCode=" + dto.getJobCode());
        System.out.println("   orgCode=" + dto.getOrganizationCode());
        // 1. 사원번호 자동 생성
        String empId = createEmployeeId();
        dto.setId(empId); // dto에 id 담기
        System.out.println("🟡 [2] 사번 생성 후 id=" + dto.getId());


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
        System.out.println("🟢 [3-1] insertEmployee: id=" + dto.getId());
        Boolean isInsertEmployee = employeeDAO.insertEmployee(dto) > 0;
        System.out.println("🟢 [3-2] insertEmployeeDepartment: id=" + dto.getId() + ", dept=" + dto.getDepartmentCode());
        Boolean isInsertEmployeeDepartment = employeeDAO.insertEmployeeDepartment(dto) > 0;
        System.out.println("🟢 [3-3] insertEmploymentStatus: id=" + dto.getId());
        Boolean isInsertEmploymentStatus = employeeDAO.insertEmploymentStatus(dto.getId()) > 0;
        System.out.println("🟢 [3-4] insertEmployeeJob: id=" + dto.getId() + ", job=" + dto.getJobCode());
        Boolean isInsertEmployeeJob = employeeDAO.insertEmployeeJob(dto) > 0;
        System.out.println("🟢 [3-5] insertEmployeeOrganization: id=" + dto.getId() + ", org=" + dto.getOrganizationCode());
        Boolean isInsertEmployeeOrganization = employeeDAO.insertEmployeeOrganization(dto) > 0;
        System.out.println("🟢 [3-6] insertEmployeeAuthority: id=" + dto.getId());
        Boolean isInsertEmployeeAuthority = employeeDAO.insertEmployeeAuthority(dto) > 0;
        Boolean isInsertPwReset = employeeDAO.insertPasswordReset(dto.getId()) > 0;

        // 전부 입력 성공시
        if (isInsertEmployee && isInsertEmployeeDepartment
                && isInsertEmploymentStatus && isInsertEmployeeJob
                && isInsertEmployeeOrganization && isInsertEmployeeAuthority
                && isInsertPwReset) {

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

            System.out.println("✅ 등록 성공: " + dto.getName() + " / 초기비밀번호: " + tempPw);
            System.out.println("✅ [5] 모든 insert 완료");

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
    public EmployeeDTO updateEmployee(EmployeeDTO dto) {
        return employeeDAO.updateEmployeeById(dto);
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
