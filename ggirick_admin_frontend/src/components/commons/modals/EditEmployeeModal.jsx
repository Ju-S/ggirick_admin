import { useState } from "react";
import useEmployeeStore from "../../../store/hr/employeeStore.js";
import CommonSelect from "../CommonSelect.jsx";
import useDepartmentStore from "../../../store/hr/departmentStore.js";
import useJobStore from "../../../store/hr/jobStore.js";
import useOrganizationStore from "../../../store/hr/organizationStore.js";
import {emailDuplCheckAPI, employeeAllListAPI, updateEmployeeAPI} from "../../../api/hr/index.js";



export default function EditEmployeeModal({ isOpen, onClose }) {
    const { selectedEmployee, updateEmployee, setEmployeeList, updateEmployeeList } = useEmployeeStore();
    const { departments } = useDepartmentStore();
    const { jobs } = useJobStore();
    const { organizations } = useOrganizationStore();
    const { employmentStatuses } = useEmployeeStore();

    const [emailCheckResult, setEmailCheckResult] = useState(null);

    // 이메일 중복확인
    const checkEmailDuplicate = async () => {
        if (!selectedEmployee.email) return alert("이메일을 입력해주세요.");
        try {
            const res = await emailDuplCheckAPI(selectedEmployee.email);
            const data = await res.json();
            if (data.exists) setEmailCheckResult("이미 사용 중인 이메일입니다 ❌");
            else setEmailCheckResult("사용 가능한 이메일입니다 ✅");
        } catch (err) {
            console.error(err);
            setEmailCheckResult("중복확인 중 오류 발생 ❗");
        }
    };

    // 수정 저장 요청
    const handleUpdate = async () => {
        try {
            const resp = await updateEmployeeAPI(selectedEmployee);

            if (resp) {
                alert("직원 정보가 수정되었습니다 ✅");

                // 기존 배열 중 동일 id 교체
                updateEmployeeList(resp);
                // 다시 직원 목록 불러오기
                const refreshed = await employeeAllListAPI();
                setEmployeeList(refreshed.data);
                onClose();
            } else {
                alert("수정 중 오류가 발생했습니다 ❌");
            }
        } catch (err) {
            console.error(err);
            alert("수정 요청 중 오류 발생 ❌");
        }
    };

    if (!isOpen || !selectedEmployee) return null;

    return (
        <dialog id="editEmployeeModal" className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
                <h3 className="font-bold text-lg mb-4">직원 정보 수정</h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* 이름 (읽기 전용) */}
                    <div>
                        <label className="label"><span className="label-text">이름</span></label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={selectedEmployee.name || ""}
                            readOnly
                        />
                    </div>

                    {/* 사번 (읽기 전용) */}
                    <div>
                        <label className="label"><span className="label-text">사번</span></label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={selectedEmployee.id || ""}
                            readOnly
                        />
                    </div>

                    {/* 이메일 + 중복확인 */}
                    <div className="col-span-2">
                        <label className="label"><span className="label-text">이메일</span></label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                className="input input-bordered flex-1"
                                value={selectedEmployee.email || ""}
                                onChange={(e) => updateEmployee("email", e.target.value)}
                            />
                            <button className="btn btn-outline btn-primary" onClick={checkEmailDuplicate}>
                                중복확인
                            </button>
                        </div>
                        {emailCheckResult && <p className="text-sm mt-1">{emailCheckResult}</p>}
                    </div>

                    {/* 부서 */}
                    <CommonSelect
                        name="departmentCode"
                        label="부서"
                        value={selectedEmployee.departmentCode}
                        options={departments.map((d) => ({
                            value: d.code,
                            label: d.name,
                        }))}
                        onChange={updateEmployee}
                    />

                    {/* 직급 */}
                    <CommonSelect
                        name="jobCode"
                        label="직급"
                        value={selectedEmployee.jobCode}
                        options={jobs.map((j) => ({
                            value: j.code,
                            label: j.name,
                        }))}
                        onChange={updateEmployee}
                    />

                    {/* 조직 */}
                    <CommonSelect
                        name="organizationCode"
                        label="조직"
                        value={selectedEmployee.organizationCode}
                        options={organizations.map((o) => ({
                            value: o.code,
                            label: o.name,
                        }))}
                        onChange={updateEmployee}
                    />

                    {/* 입사일 */}
                    <div>
                        <label className="label"><span className="label-text">입사일</span></label>
                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={selectedEmployee.hireDate?.slice(0, 10) || ""}
                            onChange={(e) => updateEmployee("hireDate", e.target.value)}
                        />
                    </div>

                    {/* 급여 */}
                    <div>
                        <label className="label"><span className="label-text">급여</span></label>
                        <input
                            type="number"
                            className="input input-bordered w-full"
                            value={selectedEmployee.salary || ""}
                            onChange={(e) => updateEmployee("salary", e.target.value)}
                        />
                    </div>

                    {/* 재직 상태 */}
                    <CommonSelect
                        name="status"
                        label="재직 상태"
                        value={selectedEmployee.status}
                        options={employmentStatuses.map((es) => ({
                            value: es.code,
                            label: es.name,
                        }))}
                        onChange={updateEmployee}
                    />
                </div>

                <div className="modal-action">
                    <button className="btn btn-primary" onClick={handleUpdate}>저장</button>
                    <button className="btn" onClick={onClose}>닫기</button>
                </div>
            </div>
        </dialog>
    );
}
