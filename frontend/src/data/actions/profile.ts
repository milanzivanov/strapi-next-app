"use server";
import { z } from "zod";

import { services } from "@/data/services";

import {
  ProfileFormSchema,
  type ProfileFormState,
} from "@/data/validation/profile";

export async function updateProfileAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  console.log("Hello From Login User Action");

  const fields = Object.fromEntries(formData);

  console.dir(fields);

  const validatedFields = ProfileFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("Validation successful:", validatedFields.data);

  const responseData = await services.profile.updateProfileService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  if (responseData.error) {
    return {
      success: false,
      message: "Failed to Login.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Login Successfully", responseData);
  console.log("#############");

  return {
    success: false,
    message: "Successfully updated form",
    strapiErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields,
    },
  };
}