import {User} from "../models/user.model.js";
import {asncHandler} from "../utils/asncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken";

export const verifyJwt = asncHandler(async (req, _, next) => {
    try {
        console.log("Headers:", req.headers); // Log headers for debugging
        console.log("Cookies:", req.cookies); // Log cookies for debugging
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        console.log("Extracted token:", token); // Log the extracted token
        
        if (!token) {
            throw new ApiError(401, "Unauthorized", "No token provided");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded token:", decoded); // Log decoded token

        const user = await User.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized", "User not found");
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); // Log the actual error
        throw new ApiError(401, "Unauthorized", error.message || "Invalid token");
    }
});

