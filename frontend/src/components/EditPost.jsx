import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  FiEdit2,
  FiTrash2,
  FiArrowLeft,
  FiClock,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";

function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.userData);
  const isAuthor = authStatus && post && post.author._id === authStatus._id;

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const [postRes, likeRes] = await Promise.all([
            axios.get(
              `${import.meta.env.VITE_PORT}/api/v1/blog/getPostById/${id}`,
              { withCredentials: true }
            ),
            axios.get(
              `${import.meta.env.VITE_PORT}/api/v1/like/toggleLike/${id}`,
              { withCredentials: true }
            ),
          ]);

          setPost(postRes.data.data);
          setIsLiked(likeRes.data.data.success); // Assuming the API returns { success: boolean }
          
        } catch (error) {
          setError("Failed to fetch data. Please try again later.");
          toast.error("Failed to fetch data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    },
    [],
    [id]
  );

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_PORT}/api/v1/blog/deletePost/${id}`,
          { withCredentials: true }
        );
        toast.success("Post deleted successfully");
        navigate("/user-blogs");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_PORT}/api/v1/like/toggleLike/${id}`,
        { withCredentials: true }
      );
      setIsLiked(res.data.data.success); // Assuming the API returns { success: boolean }
      // Assuming the API returns { success: boolean }
    } catch (error) {
      setError("Failed to toggle like. Please try again later.");
      toast.error("Failed to toggle like");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center bg-white shadow-lg p-6 rounded-lg">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 p-4"
        >
          <FiArrowLeft className="mr-2" /> Back to posts
        </button>

        {post.coverImage && (
          <div className="w-full overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full" />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              {post.title}
            </h1>
            {authStatus && !isAuthor && (
              <button onClick={handleLike} className="focus:outline-none">
                {isLiked === true ? (
                  <svg
                    className="h-10 w-10 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-10 w-10 text-gray-400 hover:text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center">
              <FiUser className="mr-1" />
              <span>{post.author?.username || "Unknown author"}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <div className="mt-6 text-gray-700 prose">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {isAuthor && (
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => navigate(`/edit-page/${id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiEdit2 className="mr-2" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FiTrash2 className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditPost;
