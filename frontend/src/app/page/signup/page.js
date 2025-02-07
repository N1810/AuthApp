"use client";

import React, { useState, useEffect } from "react";
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
    Container,
    Card,
    CardContent,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "../../api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "../google-login/page";

export default function Signup() {
    const router = useRouter();
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [message, setMessage] = useState("Loading");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API);
                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                console.error("Error fetching API data:", error);
                setMessage("Failed to load data");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage("Email and password are required");
            setErrorSnackbar(true);
            return;
        }
        try {
            const result = await axios.post(
                "http://localhost:8000/api/auth/signup",
                { email, password }
            );
            setSuccessMessage("Signup successful! Redirecting to login...");
            setOpenSnackbar(true);
            setTimeout(() => {
                router.push("/signin");
            }, 5000);
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "Signup failed");
            setErrorSnackbar(true);
            console.error("Error submitting form:", error?.message);
        }
    };

    const handleClickShowPassword = () => setIsPasswordShown((prev) => !prev);

    return (
        <>
            {message}

            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Container maxWidth="sm">
                    <Card className="p-8 bg-white shadow-md rounded-lg">
                        <CardContent>
                            <Typography
                                variant="h5"
                                className="font-bold mb-1 text-center"
                            >
                                Welcome to Materialize! 👋
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-600 mb-4 text-center"
                            >
                                Create your account and start the adventure
                            </Typography>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                            >
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={isPasswordShown ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                                                    onClick={
                                                        handleClickShowPassword
                                                    }
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControlLabel
                                    control={<Checkbox defaultChecked />}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Sign Up
                                </Button>
                                <Typography
                                    variant="body2"
                                    className="text-center mt-4 text-gray-600"
                                >
                                    Already have an account?{" "}
                                    <Link href="/signin" underline="hover">
                                        Sign in
                                    </Link>
                                </Typography>
                            </form>
                            <Divider className="my-6">
                                <Typography
                                    variant="body2"
                                    className="text-gray-500"
                                >
                                    or
                                </Typography>
                            </Divider>
                            {/* Google Auth Wrapper */}
                            <GoogleOAuthProvider clientId="1046942977592-42890k6sggupdsiufj9tsl5rmll5g167.apps.googleusercontent.com">
                                <GoogleLogin />
                            </GoogleOAuthProvider>
                        </CardContent>
                    </Card>
                </Container>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        {successMessage}
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={errorSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setErrorSnackbar(false)}
                >
                    <Alert
                        onClose={() => setErrorSnackbar(false)}
                        severity="error"
                        sx={{ width: "100%" }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}
