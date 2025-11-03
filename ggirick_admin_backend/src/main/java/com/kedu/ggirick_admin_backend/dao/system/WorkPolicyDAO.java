package com.kedu.ggirick_admin_backend.dao.system;

import com.kedu.ggirick_admin_backend.dto.system.WorkPolicyDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WorkPolicyDAO {

    private final SqlSessionTemplate sqlSession;
    private static final String NAMESPACE = "WorkPolicy.";

    // 전체 조회
    public List<WorkPolicyDTO> selectAll() {
        return sqlSession.selectList(NAMESPACE + "selectAll");
    }

    // 등록
    public void insert(WorkPolicyDTO dto) {
        sqlSession.insert(NAMESPACE + "insert", dto);
    }

    // 수정
    public void update(WorkPolicyDTO dto) {
        sqlSession.update(NAMESPACE + "update", dto);
    }

    // 삭제
    public void delete(Long policyId) {
        sqlSession.delete(NAMESPACE + "delete", policyId);
    }
}
