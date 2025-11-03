import api from "@/api/commons/apiInterceptor.js";
// 재직 상태 전체 조회
export function getAllEmploymentStatusesAPI() {
    return api({ url: "/employment-status", method: "GET" });
}
