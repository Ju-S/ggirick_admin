import apiRoutes from "@/api/commons/apiRoutes.js";
import api from "@/api/commons/apiInterceptor.js";

// 정책 목록 조회
export const workPolicyAllListAPI = () => api(apiRoutes.workPolicy.list);

// 정책 등록
export const insertAPI = (policyInfo) => api(apiRoutes.workPolicy.insert(policyInfo));

// 정책 수정
export const updateAPI = (policyInfo) => api(apiRoutes.workPolicy.put(policyInfo));

// 정책 삭제
export const deleteAPI = (policyId) => api(apiRoutes.workPolicy.delete(policyId));
