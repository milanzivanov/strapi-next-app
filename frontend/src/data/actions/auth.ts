"use server";

export async function registerUserAction(formData: FormData) {
    console.log("Hello from register user action");


    const fields = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    console.log("#############");
    console.log(fields);
    console.log("#############");
}