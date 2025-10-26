package com.kedu.ggirick_admin_backend.dao.employee;

import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EmployeeDAO {

    private final SqlSessionTemplate mybatis;

    // ID만 가져오기
    public EmployeeDTO getById(EmployeeDTO dto) {
        return mybatis.selectOne("Employee.getById", dto);
    }

    // ----------- 직원 등록시 연계 추가 작업들
    // 직원 등록
    public int insertEmployee(EmployeeDTO dto) {
        return mybatis.insert("Employee.insertEmployee", dto);
    }

    // 권한 부여 ( 직원 신규 등록시 )
    public int insertEmployeeAuthority(EmployeeDTO dto) {
        return mybatis.insert("Employee.insertEmployeeAuthority", dto);
    }

    // 부서 등록 ( 직원 신규 등록시 )
    public int insertEmployeeDepartment(EmployeeDTO dto) {
        return mybatis.insert("Employee.insertEmployeeDepartment", dto);
    }

    // 직급 등록 ( 직원 신규 등록시 )
    public int insertEmployeeJob(EmployeeDTO dto) {
        return mybatis.insert("Employee.insertEmployeeJob", dto);
    }

    // 조직 등록 ( 직원 신규 등록시 )
    public int insertEmployeeOrganization(EmployeeDTO dto) {
        return mybatis.insert("Employee.insertEmployeeOrganization", dto);
    }

    // 재직 상태 등록 ( 직원 신규 등록시 )
    public int insertEmploymentStatus(String empId) {
        return mybatis.insert("Employee.insertEmploymentStatus", empId);
    }

    // ------------------------------------------
    // 직원 삭제
    public void deleteEmployeeById(String id) {
        mybatis.delete("Employee.deleteById", id);
    }

    // 직원 수정
    public void updateEmployeeById(EmployeeDTO dto) {
        mybatis.update("Employee.updateEmployeeById", dto);
    }

    // 직원 정보 가져오기
    public EmployeeDTO getEmployeeInfo(String id) {
        return mybatis.selectOne("Employee.getEmployeeInfo", id);
    }

    // 직원 전체 목록 가져오기
    public List<EmployeeDTO> getAllEmployeeList() {
        return mybatis.selectList("Employee.getAllEmployeeList");
    }

    // 초기 비밀번호 변경 여부 테이블에 등록
    public int insertPasswordReset(String empId) {
        return mybatis.insert("Employee.insertPasswordReset", empId);
    }

    // 비밀번호 변경
    public boolean updatePassword(EmployeeDTO dto) {
        return mybatis.update("Employee.updatePassword", dto) != 0;
    }

    // 올해 마지막 사번 조회
    public String getLastEmployeeId(String yearSuffix) {
        return mybatis.selectOne("Employee.getLastEmployeeId", yearSuffix);
    }

}
