"use client";
import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Container,
    Link,
    Snackbar,
    Alert,
} from "@mui/material";
import axios from "axios";
import MailIcon from "@mui/icons-material/Mail";
import { API } from "../api";

export default function Signup() {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [message, setMessage] = useState("Loading");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
                {
                    email,
                    password,
                }
            );
            console.log("Response:", result);
            setOpenSnackbar(true);
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "Signup failed");
            setErrorSnackbar(true);
            console.error("Error submitting form:", error?.message);
        }
    };

    return (
        <>
            {message}
            <div className="flex bs-full justify-center">
                <Container
                    maxWidth="sm"
                    sx={{
                        display: "flex",
                        minHeight: "100vh",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Card
                        sx={{
                            width: "100%",
                            maxWidth: 400,
                            padding: 3,
                            boxShadow: 3,
                        }}
                    >
                        <CardHeader
                            title="Welcome "
                            sx={{ textAlign: "center", fontWeight: "bold" }}
                            subheader="Create your account"
                        />
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    margin="normal"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={isPasswordShown ? "text" : "password"}
                                    variant="outlined"
                                    margin="normal"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    startIcon={<MailIcon />}
                                >
                                    Sign Up
                                </Button>
                            </form>
                        </CardContent>
                        <CardActions
                            sx={{
                                flexDirection: "column",
                                textAlign: "center",
                            }}
                        >
                            {/* <Link href="#" underline="hover">
                                Forgot your password?
                            </Link> */}
                            <Typography variant="body2">
                                Do You have an account?{" "}
                                <Link href="#" underline="hover">
                                    Sign in
                                </Link>
                            </Typography>
                        </CardActions>
                    </Card>
                </Container>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                {/* <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Signup successful! Please login to your account.
                </Alert> */}
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
        </>
    );
}
