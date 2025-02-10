"use client";

import { useState } from "react";
import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    InputAdornment,
    TextField,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "../google-login/page";

export default function Signin() {
    const router = useRouter();
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClickShowPassword = () => setIsPasswordShown((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage("Email and password are required");
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/signin",
                { email, password }
            );

            if (response.data.success) {
                setSuccessMessage("Logged in successfully! Redirecting...");
                setOpenSnackbar(true);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 3000);
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Sign-in failed";
            if (errorMsg === "User Doesn't Exists") {
                setTimeout(() => {
                    router.push("/signup");
                }, 3000);
            }
            setErrorMessage(errorMsg);
            setOpenSnackbar(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <Typography variant="h5" className="font-bold mb-1 text-center">
                    Welcome to Materialize! 👋
                </Typography>
                <Typography
                    variant="body2"
                    className="text-gray-600 mb-4 text-center"
                >
                    Please sign-in to your account and start the adventure
                </Typography>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Email"
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        fullWidth
                        type={isPasswordShown ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <i
                                        className={`ri-${
                                            isPasswordShown
                                                ? "eye-off-line"
                                                : "eye-line"
                                        } cursor-pointer`}
                                        onClick={handleClickShowPassword}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className="flex items-center justify-between">
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remember me"
                        />
                        <Link
                            href="/forgot-password"
                            className="text-blue-600 text-sm underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Log In
                    </Button>

                    <Typography
                        variant="body2"
                        className="text-center mt-4 text-gray-600"
                    >
                        New on our platform?{" "}
                        <Link
                            href="/signup"
                            className="text-blue-600 underline"
                        >
                            Create an account
                        </Link>
                    </Typography>
                </form>

                <Divider className="my-6">
                    <Typography variant="body2" className="text-gray-500">
                        or
                    </Typography>
                </Divider>
                <GoogleOAuthProvider clientId="1046942977592-42890k6sggupdsiufj9tsl5rmll5g167.apps.googleusercontent.com">
                    <GoogleLogin />
                </GoogleOAuthProvider>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={errorMessage ? "error" : "success"}
                    sx={{ width: "100%" }}
                >
                    {errorMessage || successMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
