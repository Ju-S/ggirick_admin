package com.kedu.ggirick_admin_backend.services;

import com.kedu.ggirick_admin_backend.dao.EmployeeDAO;
import com.kedu.ggirick_admin_backend.dto.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeDAO employeeDAO;
    private final PasswordEncoder passwordEncoder;

    public EmployeeDTO getById(EmployeeDTO dto) {
        EmployeeDTO employeeDTO = employeeDAO.getById(dto);

        // ID, PW 비교
        if (employeeDTO != null && passwordEncoder.matches(dto.getPw(), employeeDTO.getPw())) {
            return employeeDTO;
        }
        return null;
    }

    public EmployeeDTO insertEmployee(EmployeeDTO dto) {
        // ✅ 1. 사원번호 자동 생성
        String empNo = generateEmployeeNo();
        dto.setId(empNo);

        // ✅ 2. 초기 비밀번호 랜덤(UUID 기반)
        String rawPw = UUID.randomUUID().toString().substring(0, 8); // 8자리만 사용
        String encodedPw = passwordEncoder.encode(rawPw);
        dto.setPw(encodedPw);

        // 임시로 이메일 핸드폰 넣기
        dto.setPhone("010-1111-2222");
        dto.setExtension("15324");
        dto.setEmail("eun@ggirick.site");

        // ✅ (선택) 초기 비밀번호 평문을 사용자에게 안내할 수 있도록 로그 출력
        System.out.println("✅ [신규 직원 등록]");
        System.out.println("사원번호: " + empNo);
        System.out.println("초기비밀번호(임시): " + rawPw);

        return employeeDAO.insertEmployee(dto);
    }

    public void deleteEmployee(String id) {
        employeeDAO.deleteEmployeeById(id);
    }

    public EmployeeDTO updateEmployee(EmployeeDTO dto) {
        return employeeDAO.updateEmployeeById(dto);
    }

    public EmployeeDTO getEmployeeInfo(String id) {
        return employeeDAO.getEmployeeInfo(id);
    }

    public List<EmployeeDTO> getAllEmployeeList() {
        return employeeDAO.getAllEmployeeList();
    }

    public boolean updatePassword(EmployeeDTO dto) {
        // 암호화 후 DB 저장
        dto.setPw(passwordEncoder.encode(dto.getPw()));
        return employeeDAO.updatePassword(dto);
    }

    private String generateEmployeeNo() {
        // 현재 연도 끝 두 자리
        String yearSuffix = String.valueOf(java.time.Year.now().getValue()).substring(2);

        // DB에서 해당 연도 마지막 사번 조회
        String lastEmpNo = employeeDAO.getLastEmployeeId(yearSuffix);

        int nextSeq = 1; // 기본값
        if (lastEmpNo != null && lastEmpNo.length() == 8) {
            // 뒤의 4자리 숫자 추출 → +1
            String seqPart = lastEmpNo.substring(4);
            nextSeq = Integer.parseInt(seqPart) + 1;
        }

        // 사번 조합: 10 + YY + 4자리 시퀀스
        return String.format("10%s%04d", yearSuffix, nextSeq);
    }

}
