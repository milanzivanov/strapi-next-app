import {
  registerUserAction,
  logoutUserAction,
  getAuthTokenAction,
  loginUserAction
} from "./auth";
import { updateProfileAction, updateProfileImageAction } from "./profile";
import { deleteSummaryAction, updateSummaryAction } from "./summary";

export const actions = {
  auth: {
    registerUserAction: registerUserAction,
    logoutUserAction: logoutUserAction,
    getAuthTokenAction: getAuthTokenAction,
    loginUserAction: loginUserAction
  },
  profile: {
    updateProfileAction: updateProfileAction,
    updateProfileImageAction: updateProfileImageAction
  },
  summary: {
    updateSummaryAction,
    deleteSummaryAction
  }
};
