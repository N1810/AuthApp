import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        mongoose
            .connect(process.env.MONGO_URL)
            .then(() => {
                console.log("Database Connected");
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (error) {
        console.log(error);
    }
};
