import { asncHandler } from "../utils/asncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

const generateAccessOrRefeshToken = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(
      500,
      error.message,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;


    if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });


    if (existingUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", createdUser));
      
  } catch (error) {
    console.error("Registration error:", error); // Detailed error logging
    throw error; // Let asyncHandler handle it
  }
});

const loginUser = asncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError("All fields are required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("Invalid credentials! User not exists", 401);
  }
  
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError("Invalid credentials! password not matched", 401);
  }

  const { accessToken, refreshToken } = await generateAccessOrRefeshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "user Login Successfully", {user: loggedInUser, accessToken, refreshToken})
    );
});

const logoutUser = asncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true}
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

const getUserProfile = asncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully",  req.user ));
});

const changePassword = asncHandler(async (req, res)=>{
    const { oldPassword, newPassword } = req.body;
    if ([oldPassword, newPassword].some((field) => field?.trim() === "")) {
        throw new ApiError("All fields are required", 400);
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
        throw new ApiError("Invalid credentials! password not matched", 401);
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully", {}));
})

const refreshAccessToken = asncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessOrRefeshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})



export { registerUser, loginUser, logoutUser, changePassword, getUserProfile, refreshAccessToken };
