import jwt from "jsonwebtoken";

export const identifier = (req, res, next) => {
    let token;
    if (req.headers.client === "not-browser") {
        token = req.headers.authorization;
    } else {
        token = req.cookies["Authorization"];
    }

    if (!token) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized" });
    }

    try {
        // Split the token to extract the actual JWT
        const userToken = token.startsWith("Bearer ")
            ? token.split(" ")[1]
            : token;
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);

        if (jwtVerified) {
            req.user = jwtVerified;
            next();
        } else {
            throw new Error("Error in the Token");
        }
    } catch (error) {
        console.error(error);
        return res
            .status(403)
            .json({ success: false, message: "Token verification failed" });
    }
};
