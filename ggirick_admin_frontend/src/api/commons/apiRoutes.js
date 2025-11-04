import {workPolicyAllListAPI} from "@/api/system/workPolicyAPI.js";
import {holidayAllListAPI} from "@/api/system/holidayAPI.js";

const apiRoutes = {
    auth: {
        /**
         * 로그인 API<br>
         * POST /auth<br>
         * body: { userId, passwd }<br>
         * response: {EmployeeDTO}
         */
        login: {url: `/auth/login`, method: "POST"},

        /**
         * 아이디 중복 확인 API<br>
         * GET /employee<br>
         * param: {empId}<br>
         * response: true(중복)/false(중복아님)
         */
        checkEmployeeId: (empId) => ({
            url: `/employee/checkDuplicateId?id=${empId}`,
            method: "GET"
        }),
    },
    selectedEmployee: {
        /**
         * 사용자 등록 API<br>
         * POST /employee<br>
         * body: {EmployeeDTO}<br>
         * response: {EmployeeDTO}
         */
        insert: {url: `/employee`, method: "POST"},

        /**
         * 사용자 삭제 API<br>
         * PATCH /employee<br>
         * body: {EmployeeDTO}
         */
        delete: {url: `/employee`, method: "DELETE"},

        /**
         * 현재 사용자 정보 조회 API<br>
         * GET /employee/me<br>
         * response: {EmployeeDTO}
         */
        me: {url: `/employee/me`, method: "GET"},

        /**
         * 사용자 정보 수정 API<br>
         * PUT /employee<br>
         * body: {EmployeeDTO}
         */
        put: {url: `/employee`, method: "PUT"},

        /**
         * 비밀번호 변경 API<br>
         * PUT /employee/password/{id}<br>
         * body: {EmployeeDTO}<br>
         * response: {errorMessage: string}
         */
        passwordChange: (empId) => ({
            url: `/employee/password/${empId}`,
            method: "PUT"
        }),

        /**
         * 직원 목록 조회 API<br>
         * GET /employee<br>
         * response: List<EmployeeDTO>
         */
        list: {url: `/employee`, method: "GET"},

        /**
         * 직원 상세 조회 API<br>
         * GET /employee/{id}<br>
         * response: EmployeeDTO
         */
        detail: (empId) => ({
            url: `/employee/${empId}`,
            method: "GET"
        }),

        /**
         * 이메일용 아이디 중복확인 API<br>
         * GET /employee/duplcheck?email={email}<br>
         */
        duplcheck: (employeeId, email) => ({
            url: `/employee/duplcheck?employeeId=${employeeId}&email=${email}`,
            method: "GET",
        }),
    },
    hrMeta: {
        /**
         * 부서 목록 조회 API<br>
         * GET /hr-meta/departments<br>
         * response: DepartmentDTO
         */
        departments: { url: `/hr-meta/departments`, method: "GET" },

        /**
         * 직급 목록 조회 API<br>
         * GET /hr-meta/jobs<br>
         * response: JobDTO
         */
        jobs: { url: `/hr-meta/jobs`, method: "GET" },

        /**
         * 조직 목록 조회 API<br>
         * GET /hr-meta/organizations<br>
         * response: OrganizationDTO
         */
        organizations: { url: `/hr-meta/organizations`, method: "GET" },

        /**
         * 재직 상태 목록 조회 API<br>
         * GET /hr-meta/statuses<br>
         * response: EmploymentStatusCodeDTO
         */
        employmentStatuses: { url: `/hr-meta/statuses`, method: "GET" },

        structure: {url: `/hr-meta/org-structure `, method: "GET"}
    },
    department: {
        /**
         * 부서 등록 API<br>
         * POST /department<br>
         * body: {departmentDTO}<br>
         * response: {departmentDTO}
         */
        insert: (departmentInfo) => ({
            url: `/department`,
            method: "POST",
            data: departmentInfo
        }),

        /**
         * 부서 삭제 API<br>
         * DELETE /department/${departmentCode}<br>
         * body: {departmentDTO}
         */
        delete: (departmentCode) => ({
            url: `/department/${departmentCode}`,
            method: "DELETE"
        }),

        /**
         * 부서 수정 API<br>
         * PUT /department<br>
         * body: {departmentDTO}
         */
        put: (departmentInfo) => ({
            url: `/department`,
            method: "PUT",
            data: departmentInfo
        }),

    },

    organization: {
        /**
         * 조직 등록 API<br>
         * POST /organization<br>
         * body: {organizationDTO}<br>
         * response: {organizationDTO}
         */
        insert: (orgInfo) => ({
            url: `/organization`,
            method: "POST",
            data: orgInfo
        }),

        /**
         * 조직 삭제 API<br>
         * DELETE /organization/${orgCode}<br>
         * body: {organizationDTO}
         */
        delete: (orgCode) => ({
            url: `/organization/${orgCode}`,
            method: "DELETE"
        }),

        /**
         * 조직 수정 API<br>
         * PUT /organization<br>
         * body: {organizationDTO}
         */
        put: (orgInfo) => ({
            url: `/organization`,
            method: "PUT",
            data: orgInfo
        }),

    },

    job: {
        /**
         * 직급 등록 API<br>
         * POST /job<br>
         * body: {jobDTO}<br>
         * response: {jobDTO}
         */
        insert: (jobInfo) => ({
            url: `/job`,
            method: "POST",
            data: jobInfo
        }),

        /**
         * 직급 삭제 API<br>
         * DELETE /job/${jobCode}<br>
         * body: {jobDTO}
         */
        delete: (jobCode) => ({
            url: `/job/${jobCode}`,
            method: "DELETE"
        }),

        /**
         * 직급 수정 API<br>
         * PUT /job<br>
         * body: {jobDTO}
         */
        put: (jobInfo) => ({
            url: `/job`,
            method: "PUT",
            data: jobInfo
        }),

        /**
         * 직급 rank 수정 API<br>
         * PUT /job/updateRankOrder<br>
         * body: {List<jobDTO>}
         */
        updateRankOrder: (jobList) => ({
            url: `/job/updateRankOrder`,
            method: "PUT",
            data: jobList
        })
    },

    workPolicy: {
        /**
         * 정책 목록 조회 API<br>
         * GET /workPolicy<br>
         * response: List<WorkPolicyDTO>
         */
        list: {url: `/workPolicy`, method: "GET"},

        /**
         * 정책 등록 API<br>
         * POST /workPolicy<br>
         * body: {WorkPolicyDTO}<br>
         * response: {WorkPolicyDTO}
         */
        insert: (policyInfo) => ({
            url: `/workPolicy`,
            method: "POST",
            data: policyInfo
        }),

        /**
         * 정책 삭제 API<br>
         * DELETE /workPolicy/${policyId}<br>
         * body: {WorkPolicyDTO}
         */
        delete: (policyId) => ({
            url: `/workPolicy/${policyId}`,
            method: "DELETE"
        }),

        /**
         * 정책 수정 API<br>
         * PUT /workPolicy<br>
         * body: {WorkPolicyDTO}
         */
        put: (policyInfo) => ({
            url: `/workPolicy`,
            method: "PUT",
            data: policyInfo
        }),


    },

    holiday: {
        /**
         * 휴일 목록 조회 API<br>
         * GET /holiday<br>
         * response: List<HolidayDTO>
         */
        list: {url: `/holiday`, method: "GET"},

        /**
         * 휴일 등록 API<br>
         * POST /holiday<br>
         * body: {HolidayDTO}<br>
         * response: {HolidayDTO}
         */
        insert: (holidayInfo) => ({
            url: `/holiday`,
            method: "POST",
            data: holidayInfo
        }),

        /**
         * 휴일 삭제 API<br>
         * DELETE /holiday/${holidayId}<br>
         * body: {HolidayDTO}
         */
        delete: (holidayId) => ({
            url: `/holiday/${holidayId}`,
            method: "DELETE"
        }),

        /**
         * 휴일 수정 API<br>
         * PUT /holiday<br>
         * body: {HolidayDTO}
         */
        put: (holidayInfo) => ({
            url: `/holiday`,
            method: "PUT",
            data: holidayInfo
        }),
    }


};

export default apiRoutes;