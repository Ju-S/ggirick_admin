import React from "react";

export default function EmployeeList({
                                         employees, search, setSearch, deptFilter, setDeptFilter
                                     }) {
    const filteredEmployees = employees.filter(
        (e) =>
            e.name.includes(search) &&
            (deptFilter === "전체 부서" || e.dept === deptFilter)
    );

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">직원 목록</h2>
                    <div className="flex gap-2">
                        <button className="btn btn-neutral">휴가 신청</button>
                        <button className="btn btn-primary">직원 추가</button>
                    </div>
                </div>

                {/* 검색 & 필터 */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="직원 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="select select-bordered w-40"
                    >
                        <option>전체 부서</option>
                        <option>경영팀</option>
                        <option>영업팀</option>
                        <option>개발팀</option>
                    </select>
                </div>

                {/* 직원 테이블 */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                        <tr className="bg-base-300">
                            <th>이름</th>
                            <th>사번</th>
                            <th>부서</th>
                            <th>직급</th>
                            <th>이메일</th>
                            <th>입사일</th>
                            <th>급여</th>
                            <th className="text-center">상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.empNo} className="hover">
                                <td>{emp.name}</td>
                                <td>{emp.empNo}</td>
                                <td>{emp.dept}</td>
                                <td>{emp.position}</td>
                                <td>{emp.email}</td>
                                <td>{emp.hireDate}</td>
                                <td>{emp.salary}</td>
                                <td className="text-center">
                                    <span className="badge badge-success">{emp.status}</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
