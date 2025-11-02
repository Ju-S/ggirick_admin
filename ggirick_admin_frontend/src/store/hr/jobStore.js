import { create } from "zustand";

const useJobStore = create((set) => ({
    // 직급 목록
    jobs: [],

    // 전체 세팅
    setJobs: (data) => set({ jobs: data }),

    // 등록 성공 시 추가
    insertJob: (newJob) =>
        set((state) => ({
            jobs: [...state.jobs, newJob],
        })),

    // 수정
    modifyJob: (code, newName) =>
        set((state) => ({
            jobs: state.jobs.map((job) =>
                job.code === code ? { ...job, name: newName } : job
            ),
        })),

    // 삭제
    deleteJob: (code) =>
        set((state) => ({
            jobs: state.jobs.filter((job) => job.code !== code),
        })),
}));

export default useJobStore;
