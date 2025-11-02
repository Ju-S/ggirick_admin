import apiRoutes from "../commons/apiRoutes.js";
import api from "../commons/apiInterceptor.js";

// 직원 등록
export function insertAPI(newEmployeeInfo) {
    return api({ ...apiRoutes.employee.insert, data: newEmployeeInfo });
}

// 직원 삭제
export const deleteEmployeeAPI = (id) =>
    api({ ...apiRoutes.employee.delete, url: `/employee/${id}` });

// 직원 정보 수정
export const updateEmployeeAPI = (data) =>
    api({ ...apiRoutes.employee.put, data });

// 내 정보 조회
export const getMyInfoAPI = () => api(apiRoutes.employee.me);

// 직원 목록 조회
export const employeeAllListAPI = () => api(apiRoutes.employee.list);

// 직원 상세 조회
export const employeeDetailAPI = (id) => api(apiRoutes.employee.detail(id));

// 이메일 중복 확인
export const emailDuplCheckAPI = (email) => api(apiRoutes.employee.duplcheck(email));