import axios from "axios";
import useCommonStore from "@/store/commonStore";

export default async function useInitCommonData() {
    const setCommon = useCommonStore.getState().setAllCommonData;

    const [deptRes, jobRes, orgRes] = await Promise.all([
        axios.get("/api/common/departments"),
        axios.get("/api/common/jobs"),
        axios.get("/api/common/organizations"),
    ]);

    setCommon({
        departments: deptRes.data,
        jobs: jobRes.data,
        organizations: orgRes.data,
    });
}
