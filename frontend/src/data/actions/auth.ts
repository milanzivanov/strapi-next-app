"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { services } from "@/data/services";
import { isAuthError } from "@/data/services/auth";


import { SignupFormSchema,SigninFormSchema, type FormState } from "@/data/validation/auth";

const config = {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};


export async function registerUserAction(prevState: FormState, formData: FormData): Promise<FormState> {
    console.log("Hello from register user action");

    const fields = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        email: formData.get("email") as string,
    };


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


      const responseData = await services.auth.registerUserService(
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
    
      // Check if responseData is an error response
      if (isAuthError(responseData)) {
        return {
          success: false,
          message: "Failed to Register.",
          strapiErrors: responseData.error,
          zodErrors: null,
          data: {
            ...prevState.data,
            ...fields,
          },
        };
      }
    
      console.log("#############");
      console.log("User Registered Successfully", responseData);
      console.log("#############");

      const cookieStore = await cookies();
      cookieStore.set("jwt", responseData.jwt, config);
      redirect("/dashboard");
}

//
export async function loginUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("Hello From Login User Action");

  const fields = {
    identifier: formData.get("identifier") as string,
    password: formData.get("password") as string,
  };

  console.dir(fields);

  const validatedFields = SigninFormSchema.safeParse(fields);

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

  const responseData = await services.auth.loginUserService(
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

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
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

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);
  redirect("/dashboard");
}

//
export async function logoutUserAction() {
  const cookieStore = await cookies();
  
  // Delete cookie with explicit settings to ensure it's cleared
  cookieStore.set("jwt", "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    expires: new Date(0),
    // Don't set domain for localhost
    ...(process.env.HOST && process.env.HOST !== "localhost" 
      ? { domain: process.env.HOST } 
      : {}),
  });
  
  console.log("🚪 Logout: Cookie cleared");
  redirect("/");
}



export async function getAuthTokenAction() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt")?.value;
  return authToken;
}
