import { asncHandler } from "../utils/asncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudnary } from "../utils/cloudnary.js";

const createPost = asncHandler(async (req, res) => {
  const { title, content, status } = req.body;

  if (!title || !content) {
    throw new ApiError("Title and content are required", 400);
  }

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError("Cover image is required", 400);
  }

  const coverImage = await uploadOnCloudnary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiError("Failed to upload cover image to cloudinary", 500);
  }

  const blog = await Blog.create({
    title,
    content,
    status,
    coverImage: coverImage.url,
    author: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Blog created successfully", blog));
});

const getUserPosts = asncHandler(async (req, res) => {
  const posts = await Blog.find({
    author: req.user._id,
  });

  if (!posts) {
    throw new ApiError("No posts found", 404);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Posts retrieved successfully", posts));
});

const getAllPosts = asncHandler(async (req, res) => {
  const posts = await Blog.find({status: "published"})
    .populate("author", "username")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, "Posts retrieved successfully", posts));
});

const getPersonalPosts = asncHandler(async (req, res) => {
  const posts = await Blog.find({
    author: req.user._id
  }).populate("author", "username")
  .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Posts retrieved successfully", posts));
});

const getPostById = asncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Blog.findById({
    _id: id,
    author: req.user._id,
  }).populate( "author", "username" ).sort({createdAt : -1})

  if (!post) {
    throw new ApiError("Post not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Post retrieved successfully", post ));
});

const updatePost = asncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;

  // Find the existing post first
  const existingPost = await Blog.findOne({ _id: id, author: req.user._id });

  if (!existingPost) {
    throw new ApiError(
      "Post not found or you're not authorized to update it",
      404
    );
  }


  let coverImageUrl = existingPost.coverImage;
  if (req.file) {
    const coverImageLocalPath = req.file.path;
    coverImageUrl = await uploadOnCloudnary(coverImageLocalPath);
    if (!coverImageUrl) {
      throw new ApiError("Failed to upload cover image to Cloudinary", 500);
    }
  }
  

  // Prepare update object
  const updateData = {
    title: title || existingPost.title,
    content: content || existingPost.content,
    status: status || existingPost.status,
    coverImage: coverImageUrl.url || existingPost.coverImage
  };

  const updatedPost = await Blog.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!updatedPost) {
    throw new ApiError("Failed to update the post", 500);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Post updated successfully", updatedPost));
});

const deletePost = asncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Blog.findOneAndDelete({
    _id: id,
    author: req.user._id,
  });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Deleted post successfully"));
});

export {
  createPost,
  getUserPosts,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPersonalPosts
};
