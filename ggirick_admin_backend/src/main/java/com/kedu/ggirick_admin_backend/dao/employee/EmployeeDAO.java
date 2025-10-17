package com.kedu.ggirick_admin_backend.dao.employee;

import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
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

    // 직원 등록
    public int insertEmployee(EmployeeDTO dto) {
       return mybatis.insert("Employee.insertEmployee", dto);
    }

    // 직원 삭제
    public void deleteEmployeeById(String id) {
        mybatis.delete("Employee.deleteById", id);
    }

    // 직원 수정
    public EmployeeDTO updateEmployeeById(EmployeeDTO dto) {
        int result = mybatis.update("Employee.updateById", dto);
        if(result != 0) {
            return getEmployeeInfo(dto.getId());
        }
        return null;
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
