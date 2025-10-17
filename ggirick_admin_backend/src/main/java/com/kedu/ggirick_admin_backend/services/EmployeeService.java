package com.kedu.ggirick_admin_backend.services;

import com.kedu.ggirick_admin_backend.dao.common.AuthorityDAO;
import com.kedu.ggirick_admin_backend.dao.common.DepartmentDAO;
import com.kedu.ggirick_admin_backend.dao.common.JobDAO;
import com.kedu.ggirick_admin_backend.dao.common.OrganizationDAO;
import com.kedu.ggirick_admin_backend.dao.employee.EmployeeDAO;
import com.kedu.ggirick_admin_backend.dao.employee.EmploymentStatusDAO;
import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
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
    private final AuthorityDAO authorityDAO;
    private final DepartmentDAO departmentDAO;
    private final JobDAO jobDAO;
    private final EmploymentStatusDAO employmentStatusDAO;
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
    public String insertEmployee(EmployeeDTO dto) {
        // 1. 사원번호 자동 생성
        String empId = createEmployeeId();
        dto.setId(empId); // dto에 id 담기

        // 2. 초기 비밀번호 랜덤(UUID 기반)
        String tempPw = UUID.randomUUID().toString().substring(0, 8); // 8자리만 사용
        String encodedPw = passwordEncoder.encode(tempPw);
        dto.setPw(encodedPw);

        // 임시 프로필 url
        String encodedName = URLEncoder.encode(dto.getName(), StandardCharsets.UTF_8); // 한글깨짐, 공백 방지
        // 프로필 랜덤 색
        String[] colors = {"14b8a6", "3b82f6", "ef4444", "8b5cf6", "f97316"};
        String randomColor = colors[new Random().nextInt(colors.length)];
        dto.setProfileUrl("https://ui-avatars.com/api/?name=" + encodedName + "&background=" + randomColor + "&color=fff&size=128");

        // 직원 등록 요청
        Boolean isInsertEmployee = employeeDAO.insertEmployee(dto) > 0;
        Boolean isInsertEmployeeDepartment = departmentDAO.insertEmployeeDepartment(dto) > 0;
        Boolean isInsertEmploymentStatus = employmentStatusDAO.insertEmploymentStatus(dto.getId()) > 0;
        Boolean isInsertEmployeeJob = jobDAO.insertEmployeeJob(dto) > 0;
        Boolean isInsertEmployeeOrganization = organizationDAO.insertEmployeeOrganization(dto) > 0;
        Boolean isInsertEmployeeAuthority = authorityDAO.insertEmployeeAuthority(dto) > 0;
        Boolean isInsertPwReset = employeeDAO.insertPasswordReset(dto.getId()) > 0;

        if (isInsertEmployee && isInsertEmployeeDepartment
                && isInsertEmploymentStatus && isInsertEmployeeJob
                && isInsertEmployeeOrganization && isInsertEmployeeAuthority
                && isInsertPwReset) {
            // 초기 비밀번호 전달
            return tempPw;
        } else { // 실패시
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
