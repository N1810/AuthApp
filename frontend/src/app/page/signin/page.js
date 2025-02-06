"use client";

import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Signin() {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const {
        control,
        formState: { errors },
    } = useForm();
    const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

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

                <form className="flex flex-col gap-4">
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email"
                                fullWidth
                                type="email"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Password"
                                fullWidth
                                type={isPasswordShown ? "text" : "password"}
                                error={!!errors.password}
                                helperText={errors.password?.message}
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
                        )}
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

                <Button
                    variant="outlined"
                    fullWidth
                    className="flex items-center justify-center gap-2 text-gray-600 border-gray-300"
                >
                    <img
                        src="/images/logos/google.png"
                        alt="Google Logo"
                        className="w-5 h-5"
                    />
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
