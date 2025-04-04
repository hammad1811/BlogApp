import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formattedDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown date';
  
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
      {post.coverImage && (
        <div className="relative h-60 w-full overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            {post.category || 'Uncategorized'}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <time className="text-xs text-gray-500" dateTime={post.createdAt}>
            {formattedDate}
          </time>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <div className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            'No content available'
          )}
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-2">
              {post.coverImage ? (
                <img 
                  src={post.coverImage}  
                  alt={post.author.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                  {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {post.author?.username || 'Unknown author'}
            </span>
          </div>
          
          <Link
            to={`/edit-blog/${post._id}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Read more
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;