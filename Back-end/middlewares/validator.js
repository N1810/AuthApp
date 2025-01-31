import * as Yup from "yup";

export const signupSchema = Yup.object({
    email: Yup.string()
        .min(6)
        .max(60)
        .required()
        .email()
        .test("tlds", "Invalid email domain", (value) =>
            value ? ["com", "net"].includes(value.split(".").pop()) : false
        ),
    password: Yup.string()
        .required()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "Password must have at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
        ),
});

export const signinSchema = Yup.object({
    email: Yup.string()
        .min(6)
        .max(60)
        .required()
        .email()
        .test("tlds", "Invalid email domain", (value) =>
            value ? ["com", "net"].includes(value.split(".").pop()) : false
        ),
    password: Yup.string()
        .required()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "Password must have at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
        ),
});

export const acceptCodeSchema = Yup.object({
    email: Yup.string()
        .min(6)
        .max(60)
        .required()
        .email()
        .test("tlds", "Invalid email domain", (value) =>
            value ? ["com", "net"].includes(value.split(".").pop()) : false
        ),
    providedCode: Yup.number().required(),
});

export const changePasswordSchema = Yup.object({
    newPassword: Yup.string()
        .required()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "Password must have at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
        ),
    oldPassword: Yup.string()
        .required()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "Password must have at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
        ),
});
