import { asncHandler } from "../utils/asncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.models.js";

const toggleLike = asncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  // Check if the user has already liked the post
  const existingLike = await Like.findOne({ postId: id, userId: userId });
  if (existingLike) {
    // If so, remove the like
    const del = await Like.findByIdAndDelete(existingLike._id);
    if (!del) {
      throw new ApiError("Failed to remove like", 500);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Like removed successfully", {data: del, success: false}));
  }
  // If not, create a new like
  const newLike = await Like.create({ postId: id, userId: userId });
    if (!newLike) {
        throw new ApiError("Failed to add like", 500);
    }
    
  return res
    .status(201)
    .json(new ApiResponse(201, "Like added successfully", {data: newLike, success: true}));
});

const totalLikes = asncHandler(async (req, res) => {
  const { id } = req.params;
  const totalLikes = await Like.countDocuments({ postId: id });
  if (totalLikes === null) {
    throw new ApiError("Failed to fetch likes", 500);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Total likes fetched successfully",totalLikes));
});

export { toggleLike, totalLikes };
