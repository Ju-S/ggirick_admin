package com.kedu.ggirick_admin_backend.dao.common;

import com.kedu.ggirick_admin_backend.dto.common.JobDTO;
import com.kedu.ggirick_admin_backend.dto.employee.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class JobDAO {
    private final SqlSessionTemplate mybatis;

    // 직급 목록 조회 ( 메타 데이터 조회용 )
    public List<JobDTO> getAllJobs() {
        return mybatis.selectList("hr.job.getAllJobs");
    }

    // 직급 코드 -> 직급명 찾기
    public String findJobName(String code) {
        return mybatis.selectOne("hr.job.findJobName", code);
    }

    // ID로 직급 조회
    public String getJobCodeById(String id) {
        return mybatis.selectOne("hr.job.getJobCodeById", id);
    }

    // ID로 직급 수정
    public void updateEmployeeJobById(EmployeeDTO dto) {
        mybatis.update("hr.job.updateEmployeeJobById", dto);
    }


}
