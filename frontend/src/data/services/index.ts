
import { registerUserService, loginUserService,getUserMeService, } from "./auth";
import { updateProfileService } from "./profile";


export const services = {
  auth: {
    registerUserService,
    loginUserService,
    getUserMeService,
  },
  profile: {
    updateProfileService,
  },
};