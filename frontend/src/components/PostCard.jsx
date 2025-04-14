import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PostCard = ({ post }) => {
  const [likesCount, setLikesCount] = useState(0);

  const formattedDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown date';

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PORT}/api/v1/like/totalLikes/${post._id}`,
          { withCredentials: true }
        );
        setLikesCount(response.data.data);
      } catch (error) {
        console.error('Error fetching likes count:', error);
      }
    };

    fetchLikes();
  }, [post._id]);
  
  return (
    <article 
      className="relative flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full border border-gray-100"
    >
      {post.coverImage && (
        <div className="relative h-60 w-full overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700  hover:scale-110`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-1">
        <div className='flex justify-between items-center mb-4'>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 shadow-sm">
              {post.category || 'Uncategorized'}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <time className="text-xs text-gray-500" dateTime={post.createdAt}>
              {formattedDate}
            </time>
          </div>
          <div className="flex items-center text-sm text-rose-500 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likesCount}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>
        
        <div className="text-gray-600 mb-5 line-clamp-3 prose prose-sm max-w-none">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            'No content available'
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 overflow-hidden mr-3 flex items-center justify-center shadow-sm">
              {post.coverImage ? (
                <img 
                  src={post.coverImage}  
                  alt={post.author.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium text-sm">
                  {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                {post.author?.username || 'Unknown author'}
              </span>
              <span className="text-xs text-gray-400">Author</span>
            </div>
          </div>
          
          <Link
            to={`/edit-blog/${post._id}`}
            className="inline-flex items-center text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
          >
            Read more
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;