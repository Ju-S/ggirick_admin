import api from "@/api/commons/apiInterceptor.js";
import apiRoutes from "@/api/commons/apiRoutes.js";

// 휴일 목록 조회
export const holidayAllListAPI = () => api(apiRoutes.holiday.list);

// 휴일 등록
export const insertAPI = (holidayInfo) => api(apiRoutes.holiday.insert(holidayInfo));

// 휴일 수정
export const updateAPI = (holidayInfo) => api(apiRoutes.holiday.put(holidayInfo));

// 휴일 삭제
export const deleteAPI = (holidayId) => api(apiRoutes.holiday.delete(holidayId));
