import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiEdit2, FiTrash2, FiArrowLeft, FiClock, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.userData);
  const isAuthor = authStatus && post && post.author._id === authStatus._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/blog/getPostById/${id}`,
          { withCredentials: true }
        );
        setPost(res.data.data);
      } catch (error) {
        setError("Failed to fetch post. Please try again later.");
        toast.error("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/blog/deletePost/${id}`,
          { withCredentials: true }
        );
        toast.success("Post deleted successfully");
        navigate("/user-blogs");
      } catch (error) {
        toast.error("Failed to delete post");
      }
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
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go Back</button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 p-4">
          <FiArrowLeft className="mr-2" /> Back to posts
        </button>

        {post.coverImage && (
          <div className="w-full overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full" />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{post.title}</h1>
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
              <button onClick={() => navigate(`/edit-page/${id}`)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FiEdit2 className="mr-2" /> Edit
              </button>
              <button onClick={handleDelete} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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