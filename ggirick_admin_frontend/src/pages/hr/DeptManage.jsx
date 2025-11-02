import CommonManagePage from "@/components/hr/CommonManagePage.jsx";
import useDepartmentStore from "@/store/hr/departmentStore.js";
import {
    insertDepartmentAPI,
    updateDepartmentAPI,
    deleteDepartmentAPI,
} from "@/api/hr/departmentAPI.js";

export default function DeptManage() {
    const { departments, setDepartments } = useDepartmentStore();

    const deptFields = [
        { name: "code", label: "부서 코드", type: "text", required: true },
        { name: "name", label: "부서명", type: "text", required: true },
    ];

    return (
        <CommonManagePage
            entityName="부서"
            dataList={departments}
            setDataList={setDepartments}
            fields={deptFields}
            api={{
                insert: insertDepartmentAPI,
                update: updateDepartmentAPI,
                delete: deleteDepartmentAPI,
            }}
        />
    );
}
