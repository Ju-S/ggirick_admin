import { create } from "zustand";

const useOrganizationStore = create((set) => ({
    // 조직 목록
    organizations: [],

    // 전체 세팅
    setOrganizations: (data) => set({ organizations: data }),

    // 등록 성공 시 추가
    insertOrganization: (newOrg) =>
        set((state) => ({
            organizations: [...state.organizations, newOrg],
        })),

    // 수정
    modifyOrganization: (code, newName) =>
        set((state) => ({
            organizations: state.organizations.map((org) =>
                org.code === code ? { ...org, name: newName } : org
            ),
        })),

    // 삭제
    deleteOrganization: (code) =>
        set((state) => ({
            organizations: state.organizations.filter((org) => org.code !== code),
        })),
}));

export default useOrganizationStore;
