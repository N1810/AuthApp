import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is Required"],
            trim: true,
        },
        description: {
            type: {
                type: String,
                required: [true, "Description is required"],
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                require: true,
            },
        },
    },
    {
        timespamp: true,
    }
);

module.exports = mongoose.model("Post", postSchema);
