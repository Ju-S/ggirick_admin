package com.kedu.ggirick_admin_backend.services.hr;

import com.kedu.ggirick_admin_backend.dao.hr.JobDAO;
import com.kedu.ggirick_admin_backend.dto.hr.DepartmentDTO;
import com.kedu.ggirick_admin_backend.dto.hr.JobDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobDAO jobDAO;

    // 직급 목록 조회 ( 메타 데이터 조회용 )
    public List<JobDTO> getAllJobs() {
        return jobDAO.getAllJobs();
    }

    // 직급 등록
    public boolean insertJob(JobDTO dto) {
        // 직급 코드 중복 여부 확인
        if (jobDAO.checkDuplicateJobCode(dto.getCode()) > 0) {
            return false;
        }
        jobDAO.insertJob(dto);
        return true;
    }

    // 직급 수정
    public void updateJobNameByCode(JobDTO dto) {
        jobDAO.updateJobNameByCode(dto);
    }

    // 직급 삭제
    public void deleteJobByCode(String code) {
        jobDAO.deleteJobByCode(code);
    }

    // 직급 새로 등록 -> 전체 수정
    @Transactional
    public void insertJobAndUpdateRankOrder(List<JobDTO> jobList) {
        for (JobDTO job : jobList) {
            Map<String, Object> param = new HashMap<>();
            param.put("code", job.getCode());
            param.put("name", job.getName());
            param.put("rankOrder", job.getRankOrder());
            jobDAO.insertJobAndUpdateRankOrder(param);
        }
    }
}
