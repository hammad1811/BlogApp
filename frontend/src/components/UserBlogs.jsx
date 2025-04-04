import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PostCard from "./PostCard";
import { FiBook, FiRefreshCw, FiAlertCircle, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

function UserBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const status = useSelector((state) => state.auth.isActive);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/blog/getPersonalPosts",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (res.data && Array.isArray(res.data.data)) {
          setPosts(res.data.data);
          setFilteredPosts(res.data.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.content &&
          post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/blog/getPersonalPosts",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (res.data && Array.isArray(res.data.data)) {
        setPosts(res.data.data);
        setFilteredPosts(res.data.data);
      }
    } catch (err) {
      setError("Failed to refresh posts.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-lg text-gray-600">
            Loading your blog posts...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            Error loading posts
          </h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center mx-auto"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiBook className="mr-2" />
              My Blog Posts
            </h1>
            <p className="mt-2 text-gray-600">
              {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "post" : "posts"} found
            </p>
          </div>

          <div className="w-full sm:w-auto flex space-x-3">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleRefresh}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              <FiRefreshCw className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Refresh</span>
            </button>

            {status && (
              <Link
                to="/write-blog"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              >
                <FiPlus className="h-4 w-4" />
                <span className="ml-1">New Post</span>
              </Link>
            )}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No posts found
            </h3>
            <p className="mt-1 text-gray-600">
              {searchTerm
                ? "Try a different search term"
                : "You haven't created any posts yet"}
            </p>
            {status && (
              <div className="mt-6">
                <Link
                  to="/write-blog"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Create your first post
                </Link>
              </div>
            )}
          </div>
          
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBlogs;
