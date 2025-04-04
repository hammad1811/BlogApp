import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import RTE from "./RTE";
import { FiUpload, FiBook, FiEdit2, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function WriteBlog({ post }) {
  const [message, setMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.coverImage || null);
  const [selectedImage, setSelectedImage] = useState(null);


  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      status: post?.status || "draft",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Store selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("status", data.status);

      if (selectedImage) {
        formData.append("coverImage", selectedImage);
      }

      let response;
      if (post && post._id) {
        // If editing, use PUT request
        response = await axios.put(
          `http://localhost:8000/api/v1/blog/updatePost/${post._id}`,
          formData,
          { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
        );
        setMessage({ type: "success", text: "Blog updated successfully!" });
        reset();
        setSelectedImage(null);
        setImagePreview(null);
        navigate(`/user-blogs`);
      } else {
        // If creating new post, use POST request
        response = await axios.post(
          "http://localhost:8000/api/v1/blog/createPost",
          formData,
          { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
        );
        setMessage({ type: "success", text: "Blog published successfully!" });
        reset();
        setImagePreview(null);
        setSelectedImage(null);
        navigate(`/user-blogs`);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save blog. Please try again!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <FiEdit2 className="inline mr-2" />
            {post && post._id ? "Edit The Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Share your thoughts and ideas with the world
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          {/* Status Message */}
          {message && (
            <div
              className={`p-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              <div className="flex items-center">{message.text}</div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Post Title
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBook className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="title"
                  type="text"
                  placeholder="Your amazing post title"
                  {...register("title", { required: "Title is required" })}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <RTE
                label="Post Content"
                name="content"
                control={control}
                defaultValue={getValues("content")}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <div className="mt-1 flex flex-col items-center">
                {imagePreview && (
                  <div className="relative w-full h-64 rounded-md overflow-hidden mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  className="hidden"
                  id="image-upload"
                  {...register("image", { onChange: handleImageChange })}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md w-full"
                >
                  <FiUpload className="h-12 w-12 text-gray-400" />
                  <span className="ml-3 text-sm text-gray-600">
                    Upload an image
                  </span>
                </label>
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Publication Status
              </label>
              <select
                id="status"
                {...register("status", { required: "Status is required" })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="draft">Draft (Save privately)</option>
                <option value="published">
                  Published (Share with everyone)
                </option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {post && post._id ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
