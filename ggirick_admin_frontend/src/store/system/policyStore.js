// src/store/system/policyStore.js
import {create} from "zustand";
import {getAllPoliciesAPI} from "@/api/system/workPolicyAPI.js";

const usePolicyStore = create((set) => ({
    policies: [],
    selectedPolicy: null,

    // 정책 목록 불러오기
    getPolicies: async () => {
        try {
            const res = await getAllPoliciesAPI();
            if (res.data) set({ policies: res.data });
        } catch (err) {
            console.error("근무정책 조회 실패:", err);
        }
    },

    // 선택한 정책 설정
    setSelectedPolicy: (policy) => set({ selectedPolicy: policy }),

    // 정책 추가
    addPolicy: (newPolicy) =>
        set((state) => ({ policies: [...state.policies, newPolicy] })),

    // 정책 수정
    updatePolicy: (updatedPolicy) =>
        set((state) => ({
            policies: state.policies.map((p) =>
                p.id === updatedPolicy.id ? updatedPolicy : p
            ),
        })),

    // 정책 삭제
    removePolicy: (id) =>
        set((state) => ({
            policies: state.policies.filter((p) => p.id !== id),
        })),
}));

export default usePolicyStore;
