import apiRoutes from "@/api/commons/apiRoutes.js";
import api from "@/api/commons/apiInterceptor.js";

// 부서 등록
export const insertDepartmentAPI = (departmentInfo) => api(apiRoutes.department.insert(departmentInfo));

// 부서 수정
export const updateDepartmentAPI = (departmentInfo) => api(apiRoutes.department.put(departmentInfo));

// 부서 삭제
export const deleteDepartmentAPI = (departmentCode) => api(apiRoutes.department.delete(departmentCode));
