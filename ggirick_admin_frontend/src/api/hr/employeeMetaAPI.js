import apiRoutes from "../commons/apiRoutes.js";
import api from "../commons/apiInterceptor.js";

// 부서 목록 조회
export const getDepartmentsAPI = () => api(apiRoutes.hrMeta.departments);

// 직급 목록 조회
export const getJobsAPI = () => api(apiRoutes.hrMeta.jobs);

// 조직 목록 조회
export const getOrganizationsAPI = () => api(apiRoutes.hrMeta.organizations);

// 재직 상태 목록 조회
export const getAllEmploymentStatusesAPI = () => api(apiRoutes.hrMeta.employmentStatuses);

export const getHrMetaStructureAPI = () =>api(apiRoutes.hrMeta.structure);