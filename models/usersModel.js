import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email Required!"],
            trim: true,
            unique: [true, "Email Must be Unique"],
            minLength: [5, "Email Must Have 5 Characters"],
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password Must be Provided!"],
            trim: true,
            select: false,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            select: false,
        },
        verificationCodeValidation: {
            type: Number,
            select: false,
        },
        forgotPassword: {
            type: String,
            select: false,
        },
        forgotPasswordValidation: {
            type: Number,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
