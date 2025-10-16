import api from "../commons/apiInterceptor.js";

/**
 * 조직 관리 API
 * - 조직 등록, 수정, 삭제, 구성원 관리
 */
export const OrganizationAPI = {
    // 조직 전체 조회
    list: () => api({ url: "/organization/list", method: "GET" }),

    // 조직 상세 조회
    detail: (orgCode) => api({ url: `/organization/${orgCode}`, method: "GET" }),

    // 조직 생성
    create: (data) => api({ url: "/organization", method: "POST", data }),

    // 조직 수정
    update: (data) => api({ url: "/organization", method: "PUT", data }),

    // 조직 삭제
    remove: (orgCode) => api({ url: `/organization/${orgCode}`, method: "DELETE" }),

    // 조직별 직원 조회
    getEmployeesByOrg: (orgCode) =>
        api({ url: `/organization/${orgCode}/employees`, method: "GET" }),

    // 조직에 직원 추가
    addEmployeeToOrg: (data) =>
        api({ url: "/organization/add-employee", method: "POST", data }),

    // 조직에서 직원 제거
    removeEmployeeFromOrg: (data) =>
        api({ url: "/organization/remove-employee", method: "DELETE", data }),
};
