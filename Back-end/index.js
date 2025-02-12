import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRouter from "./routers/authRouter.js";
import session from "express-session";
import passport from "passport";

connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 6000 * 60,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.post("/register", (req, res) => {});

app.get("/", (req, res) => {
    res.json({ message: "Hello! Server Started" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
