import api from "../commons/apiInterceptor.js";
import apiRoutes from "../commons/apiRoutes.js";

export function loginAPI(loginInfo) {
    return api({...apiRoutes.auth.login, data: loginInfo});
}

export function checkEmployeeIdAPI(empId) {
    return api(apiRoutes.auth.checkEmployeeId(empId));
}