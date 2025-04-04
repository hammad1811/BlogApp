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
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        if (res.data?.data) {
          setPost(res.data.data);
        } else {
          throw new Error("Invalid API response format");
        }
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
        console.error("Delete error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-lg">
          <div className="text-gray-600 text-lg mb-4">Post not found</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) 
    : 'Unknown date';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to posts
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Full-width image */}
          {post.coverImage && (
            <div className="w-full h-full overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                <div className="flex items-center space-x-4 text-gray-500">
                  <div className="flex items-center">
                    <FiUser className="mr-1" />
                    <span>{post.author?.username || 'Unknown author'}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
              
              {isAuthor && (
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    onClick={() => navigate(`/edit-page/${id}`)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiTrash2 className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="prose max-w-none text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPost;