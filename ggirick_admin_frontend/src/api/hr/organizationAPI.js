import apiRoutes from "@/api/commons/apiRoutes.js";
import api from "@/api/commons/apiInterceptor.js";

// 직급 등록
export const insertOrganizationAPI = (orgInfo) => api(apiRoutes.organization.insert(orgInfo));

// 직급 수정
export const updateOrganizationAPI = (orgInfo) => api(apiRoutes.organization.put(orgInfo));

// 직급 삭제
export const deleteOrganizationAPI = (orgCode) => api(apiRoutes.organization.delete(orgCode));
