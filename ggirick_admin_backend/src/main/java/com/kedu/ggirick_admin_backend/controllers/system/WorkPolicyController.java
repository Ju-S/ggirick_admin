package com.kedu.ggirick_admin_backend.controllers.system;

import com.kedu.ggirick_admin_backend.dto.auth.UserTokenDTO;
import com.kedu.ggirick_admin_backend.dto.system.WorkPolicyDTO;
import com.kedu.ggirick_admin_backend.services.system.WorkPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workPolicy")
@RequiredArgsConstructor
public class WorkPolicyController {

    private final WorkPolicyService workPolicyService;

    // 전체 정책 조회
    @GetMapping
    public ResponseEntity<List<WorkPolicyDTO>> getAllPolicies() {
        return ResponseEntity.ok(workPolicyService.getAllPolicies());
    }

    // 정책 등록
    @PostMapping
    public ResponseEntity<String> insertPolicy(@RequestBody WorkPolicyDTO dto,
                                               @AuthenticationPrincipal UserTokenDTO userInfo) {
        // 정책 입력한 사람 id 넣기 (로그인한 사람 id)
        dto.setChangedBy(userInfo.getId());
        workPolicyService.insertPolicy(dto);
        return ResponseEntity.ok("근무정책이 등록되었습니다.");
    }

    // 정책 수정
    @PutMapping
    public ResponseEntity<String> updatePolicy(@RequestBody WorkPolicyDTO dto,
                                               @AuthenticationPrincipal UserTokenDTO userInfo) {
        // 정책 입력한 사람 id 넣기 (로그인한 사람 id)
        dto.setChangedBy(userInfo.getId());
        workPolicyService.updatePolicy(dto);
        return ResponseEntity.ok("근무정책이 수정되었습니다.");
    }

    // 정책 삭제
    @DeleteMapping("/{policyId}")
    public ResponseEntity<String> deletePolicy(@PathVariable Long policyId) {
        workPolicyService.deletePolicy(policyId);
        return ResponseEntity.ok("근무정책이 삭제되었습니다.");
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
