import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
    signupSchema,
    signinSchema,
    acceptCodeSchema,
    changePasswordSchema,
} from "../middlewares/validator.js";
import axios from "axios";
import User from "../models/usersModel.js";
import { doHash, doHashValidation, hmacProcess } from "../utils/hashing.js";
import transport from "../middlewares/sendMail.js";
import { oauth2Client } from "../utils/googleConfig.js";
import usersModel from "../models/usersModel.js";
import crypto from "crypto";

export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { error } = signupSchema.validate({ email, password });

        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(401)
                .json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword,
        });

        const result = await newUser.save();
        result.password = undefined;

        res.status(201).json({
            success: true,
            message: "Your account has been created successfully",
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error } = signinSchema.validate({ email, password });
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: "User Doesn't Exists" });
        }
        const result = await doHashValidation(password, existingUser.password);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password!",
            });
        }
        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "8h",
            }
        );
        res.cookie("Authorization", "Bearer" + token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
        }).json({
            success: true,
            token,
            message: "logged in Successfully",
        });
    } catch (error) {
        console.log(error);
    }
};

export const signout = async (req, res) => {
    res.clearCookie("Authorization")
        .status(200)
        .json({ success: true, message: "Logged Out Successfully" });
};

export const sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res
                .status(404)
                .json({ success: false, message: "User does not exists!" });
        }
        if (existingUser.verified) {
            return res.status(400).json({
                success: false,
                message: "You are already verified!",
            });
        }
        const codeValue = Math.floor(Math.random() * 1000000).toString();
        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: "Verification Code",
            html: "<h1>" + codeValue + "<h1>",
        });
        if (info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(
                codeValue,
                process.env.HMAC_VERIFICATION_CODE_SECRET
            );
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({
                success: true,
                message: "Code Sent",
            });
        }
        res.status(200).json({
            success: true,
            message: "Code Sent Failed",
        });
    } catch (error) {
        console.log(error);
    }
};
export const verifyVerificationCode = async (req, res) => {
    const { email, providedCode } = req.body;
    try {
        const { error, value } = acceptCodeSchema.validate({
            email,
            providedCode,
        });
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({ email }).select(
            "+verificationCode +verificationCodeValidation"
        );

        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: "User does not exist!" });
        }
        if (existingUser.verified) {
            return res
                .status(400)
                .json({ success: false, message: "You are already verified!" });
        }

        if (
            !existingUser.verificationCode ||
            !existingUser.verificationCodeValidation
        ) {
            return res.status(400).json({
                success: false,
                message: "Something is wrong with the code!",
            });
        }

        if (
            Date.now() - existingUser.verificationCodeValidation >
            5 * 60 * 1000
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Code has expired!" });
        }

        const hashedCodeValue = hmacProcess(
            codeValue,
            process.env.HMAC_VERIFICATION_CODE_SECRET
        );

        if (hashedCodeValue === existingUser.verificationCode) {
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({
                success: true,
                message: "Your account has been verified!",
            });
        }

        return res
            .status(400)
            .json({ success: false, message: "An unexpected error occurred!" });
    } catch (error) {
        console.error(error);
    }
};

export const changePassword = async (req, res) => {
    const { userId, verified } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        const { error } = changePasswordSchema.validate({
            oldPassword,
            newPassword,
        });

        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message,
            });
        }

        if (!verified) {
            return res.status(401).json({
                success: false,
                message: "You are not a verified user!",
            });
        }

        const existingUser = await User.findOne({ _id: userId }).select(
            "+password"
        );

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User does not exist!",
            });
        }

        const result = await doHashValidation(
            oldPassword,
            existingUser.password
        );

        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials!",
            });
        }

        const hashedPassword = await doHash(newPassword, 12);
        existingUser.password = hashedPassword;
        await existingUser.save();

        return res.status(200).json({
            success: true,
            message: "Password updated!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the password.",
        });
    }
};

export const googleAuth = async (req, res) => {
    const { code } = req.query;
    try {
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const { data } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email } = data;

        let user = await usersModel.findOne({ email }).select("+password");
        if (!user) {
            const randomPassword = crypto.randomBytes(10).toString("hex");
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await usersModel.create({ email, password: hashedPassword });
        }

        const { _id } = user;
        const token = jwt.sign({ _id, email }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT,
        });

        return res.status(200).json({ message: "success", token, user });
    } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const authStaus = async () => {};

export const setup2FA = async () => {};

export const verify2FA = async () => {};

export const reset2FA = async () => {};

export const facebookAuth = async (req, res) => {};
