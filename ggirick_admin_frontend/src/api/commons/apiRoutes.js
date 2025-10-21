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
    employee: {
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
        })
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
        employmentStatuses: { url: `/hr-meta/statuses`, method: "GET" }
    }

};

export default apiRoutes;