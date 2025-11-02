// ✅ employmentStatusStore.js
import { create } from "zustand";

const useEmploymentStatusStore = create((set) => ({
    // 재직 상태 목록 (예: 재직, 휴직, 퇴사 등)
    employmentStatuses: [],

    // 목록 세팅
    setEmploymentStatuses: (list) => set({ employmentStatuses: list }),

    // 특정 항목 수정 시
    updateEmploymentStatus: (code, newData) =>
        set((state) => ({
            employmentStatuses: state.employmentStatuses.map((s) =>
                s.value === code ? { ...s, ...newData } : s
            ),
        })),
}));

export default useEmploymentStatusStore;
