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

// 부서·직급·조직, 재직상태 한번에 불러오기
export const getAllHrMetaAPI = async () => { // async : 비동기로 처리
    try {
        const [deptRes, jobRes, orgRes, empStatusRes] = await Promise.all([ // 전체를 한 쌍처럼 묶기
            getDepartmentsAPI(),
            getJobsAPI(),
            getOrganizationsAPI(),
            getAllEmploymentStatusesAPI()
        ]);

        console.log(empStatusRes);

        return {
            departments: deptRes.data.map(d => ({ value: d.code, label: d.name })),
            jobs: jobRes.data.map(j => ({ value: j.code, label: j.name })),
            organizations: orgRes.data.map(o => ({ value: o.code, label: o.name,})),
            employmentStatuses: empStatusRes.data.map(es => ({ value: es.code, label: es.name }))
        };
    } catch (err) { // 앱 전체가 멈추는 것을 방지
        console.error("HR 메타데이터 로드 실패:", err);
        throw err;
    }
};
