import apiRoutes from "@/api/commons/apiRoutes.js";
import api from "@/api/commons/apiInterceptor.js";

// 직급 등록
export const insertJobAPI = (jobInfo) => api(apiRoutes.job.insert(jobInfo));

// 직급 수정
export const updateJobAPI = (jobInfo) => api(apiRoutes.job.put(jobInfo));

// 직급 삭제
export const deleteJobAPI = (jobCode) => api(apiRoutes.job.delete(jobCode));

// 직급 등록 후 rank 재정렬
export const updateRankOrderAPI = (jobList) => api(apiRoutes.job.updateRankOrder(jobList));