import CommonManagePage from "@/components/hr/CommonManagePage.jsx";
import useOrganizationStore from "@/store/hr/organizationStore.js";
import {
    insertOrganizationAPI,
    updateOrganizationAPI,
    deleteOrganizationAPI,
} from "@/api/hr/organizationAPI.js";

export default function OrgManage() {
    const { organizations, setOrganizations } = useOrganizationStore();

    const orgFields = [
        { name: "code", label: "조직 코드", type: "text", required: true },
        { name: "name", label: "조직명", type: "text", required: true },
    ];

    return (
        <CommonManagePage
            entityName="조직"
            dataList={organizations}
            setDataList={setOrganizations}
            fields={orgFields}
            api={{
                insert: insertOrganizationAPI,
                update: updateOrganizationAPI,
                delete: deleteOrganizationAPI,
            }}
        />
    );
}
