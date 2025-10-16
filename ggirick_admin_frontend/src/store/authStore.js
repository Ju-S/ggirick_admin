import {create} from "zustand/react";

const useAuthStore = create(set => ({
    token: "",
    isLogin:true,
    login: (token) => {
        if (token !== "") {
            sessionStorage.setItem("token", token);
        }
        set({token: token, isLogin:true});
    },
    logout: () => {
        sessionStorage.removeItem("token");
        set({token: "", isLogin:false});
    },
}));

export default useAuthStore;