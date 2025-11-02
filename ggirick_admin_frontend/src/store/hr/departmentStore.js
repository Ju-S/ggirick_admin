import { create } from "zustand";

const useDepartmentStore = create((set) => ({
    // 상태값
    departments: [],

    // Setter
    setDepartments: (data) => set({ departments: data }),

    // 추가 (등록 성공 후 UI 즉시 반영)
    insertDepartment: (newDept) =>
        set((state) => ({
            departments: [...state.departments, newDept],
        })),

    // 수정
    modifyDepartment: (code, newName) =>
        set((state) => ({
            departments: state.departments.map((dept) =>
                dept.code === code ? { ...dept, name: newName } : dept
            ),
        })),

    // 삭제
    deleteDepartment: (code) =>
        set((state) => ({
            departments: state.departments.filter((dept) => dept.code !== code),
        })),
}));

export default useDepartmentStore;
