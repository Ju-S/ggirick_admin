package com.kedu.ggirick_admin_backend.dao.hr;

import com.kedu.ggirick_admin_backend.dto.hr.JobDTO;
import com.kedu.ggirick_admin_backend.dto.hr.EmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class JobDAO {
    private final SqlSessionTemplate mybatis;

    // 직급 목록 조회 ( 메타 데이터 조회용 )
    public List<JobDTO> getAllJobs() {
        return mybatis.selectList("Job.getAllJobs");
    }

    // 직급 코드 -> 직급명 찾기
    public String findJobName(String code) {
        return mybatis.selectOne("Job.findJobName", code);
    }

    // employeeID로 직급 조회
    public String getJobCodeById(String id) {
        return mybatis.selectOne("Job.getJobCodeById", id);
    }

    // employeeID로 직급 수정
    public void updateEmployeeJobById(EmployeeDTO dto) {
        mybatis.update("Job.updateEmployeeJobById", dto);
    }

    // 직급 등록
    public void insertJob(JobDTO dto) {
        mybatis.insert("Job.insertJob", dto);
    }

    // 직급 수정
    public void updateJobNameByCode(JobDTO dto) {
        mybatis.update("Job.updateJobNameByCode", dto);
    }

    // 직급 삭제
    public void deleteJobByCode(String code) {
        mybatis.delete("Job.deleteJobByCode", code);
    }

    // 직급 코드 중복 확인
    public int checkDuplicateJobCode(String code) {
        return mybatis.selectOne("Job.checkDuplicateJobCode", code);
    }

    // 직급 새로 등록 -> 전체 수정
    public void insertJobAndUpdateRankOrder(Map<String, Object> param) {
        mybatis.update("Job.insertJobAndUpdateRankOrder", param);
    }
}
