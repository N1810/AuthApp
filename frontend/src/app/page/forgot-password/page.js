"use client";
import { Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Reset link sent to:", email);
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm text-center">
                    <Typography variant="h5" className="font-semibold mb-2">
                        Forgot Password{" "}
                        <span role="img" aria-label="lock">
                            🔒
                        </span>
                    </Typography>
                    <Typography className="text-gray-600 mb-6">
                        Enter your email and we'll send you instructions to
                        reset your password
                    </Typography>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: "#635BFF",
                                "&:hover": { backgroundColor: "#5248cc" },
                            }}
                        >
                            Send reset link
                        </Button>
                    </form>

                    <Typography className="mt-4 text-sm">
                        <Link
                            href="/login"
                            className="text-indigo-600 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </Typography>
                </div>
            </div>
        </>
    );
}
