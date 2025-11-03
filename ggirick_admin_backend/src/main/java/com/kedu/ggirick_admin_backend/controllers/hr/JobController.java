package com.kedu.ggirick_admin_backend.controllers.hr;

import com.kedu.ggirick_admin_backend.dto.hr.DepartmentDTO;
import com.kedu.ggirick_admin_backend.dto.hr.JobDTO;
import com.kedu.ggirick_admin_backend.services.hr.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/job")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;

    // 직급 등록
    @PostMapping
    public ResponseEntity<String> insertJob(@RequestBody JobDTO dto) {
        boolean result = jobService.insertJob(dto);
        if (result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409 중복 코드
    }

    // 직급 수정
    @PutMapping
    public ResponseEntity<String> updateJobNameByCode(@RequestBody JobDTO dto) {
        jobService.updateJobNameByCode(dto);
        return ResponseEntity.ok().build();
    }

    // 직급 삭제
    @DeleteMapping("/{jobCode}")
    public ResponseEntity<String> deleteJobByCode(@PathVariable("jobCode") String code) {
        jobService.deleteJobByCode(code);
        return ResponseEntity.ok().build();
    }

    // 직급 등록 후 rankOrder 재정렬
    @PutMapping("/updateRankOrder")
    public ResponseEntity<Void> insertJobAndUpdateRankOrder(@RequestBody List<JobDTO> jobList) {
        jobService.insertJobAndUpdateRankOrder(jobList);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
