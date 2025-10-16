package com.kedu.ggirick_admin_backend.dao;

import com.kedu.ggirick_admin_backend.dto.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EmployeeDAO {

    private final SqlSessionTemplate mybatis;

    public EmployeeDTO getById(EmployeeDTO dto) {
        return mybatis.selectOne("Employee.getById", dto);
    }

    public EmployeeDTO insertEmployee(EmployeeDTO dto) {
       int result = mybatis.insert("Employee.insertEmployee", dto);
       if(result != 0) {
           return getEmployeeInfo(dto.getId());
       }
       return null;
    }

    public void deleteEmployeeById(String id) {
        mybatis.delete("Employee.deleteById", id);
    }

    public EmployeeDTO updateEmployeeById(EmployeeDTO dto) {
        int result = mybatis.update("Employee.updateById", dto);
        if(result != 0) {
            return getEmployeeInfo(dto.getId());
        }
        return null;
    }

    public EmployeeDTO getEmployeeInfo(String id) {
        return mybatis.selectOne("Employee.getEmployeeInfo", id);
    }

    public List<EmployeeDTO> getAllEmployeeList() {
        return mybatis.selectList("Employee.getAllEmployeeList");
    }

    public boolean updatePassword(EmployeeDTO dto) {
        return mybatis.update("Employee.updatePassword", dto) != 0;
    }

    // 올해 마지막 사번 조회
    public String getLastEmployeeId(String yearSuffix) {
        return mybatis.selectOne("Employee.getLastEmployeeId", yearSuffix);
    }

}
