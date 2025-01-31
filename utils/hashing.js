import bcrypt from "bcryptjs";
import { createHmac } from "crypto";
const { hash, compare } = bcrypt;
export const doHash = async (value, saltValue) => {
    return await hash(value, saltValue);
};

export const doHashValidation = async (value, hashedValue) => {
    return await compare(value, hashedValue);
};

export const hmacProcess = (value, key) => {
    return createHmac("sha256", key).update(value).digest("hex");
};
