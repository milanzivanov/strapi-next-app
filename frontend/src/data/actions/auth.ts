"use server";

import { z } from "zod";
import { SignupFormSchema, type FormState } from "@/data/validation/auth";

export async function registerUserAction(prevState: FormState, formData: FormData): Promise<FormState> {
    console.log("Hello from register user action");


    // const fields = {
    //     username: formData.get("username") as string,
    //     email: formData.get("email") as string,
    //     password: formData.get("password") as string,
    // }
    const fields = Object.fromEntries(formData.entries());

    const validatedFields = SignupFormSchema.safeParse(fields);
    // console.log("validatedFields", validatedFields);

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
    
      // TODO: WE WILL ADD STRAPI LOGIC HERE LATER


    return {
        success: true,
        message: "User registration successful",
        strapiErrors: null,
        zodErrors: null,
        data: {
        ...prevState.data,
        ...fields,
        },
    }
}