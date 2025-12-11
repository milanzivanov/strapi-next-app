import { registerUserAction,  logoutUserAction,
    getAuthTokenAction, loginUserAction } from "./auth";
    import { updateProfileAction, updateProfileImageAction } from "./profile";

export const actions = {
    auth: {
        registerUserAction: registerUserAction,
        logoutUserAction: logoutUserAction,
        getAuthTokenAction: getAuthTokenAction,
        loginUserAction: loginUserAction,
    },
    profile: {
        updateProfileAction: updateProfileAction,
        updateProfileImageAction: updateProfileImageAction,
    },
}