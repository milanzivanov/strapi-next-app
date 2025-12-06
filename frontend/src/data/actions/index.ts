import { registerUserAction,  logoutUserAction,
    getAuthTokenAction, loginUserAction } from "./auth";

export const actions = {
    auth: {
        registerUserAction: registerUserAction,
        logoutUserAction: logoutUserAction,
        getAuthTokenAction: getAuthTokenAction,
        loginUserAction: loginUserAction,
    }
}