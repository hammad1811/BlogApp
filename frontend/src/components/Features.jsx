import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from './PostCard';
const Features = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
 useEffect(() => {
    const fetchedPosts = async ()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_PORT}/api/v1/blog/getAllPosts`);
        setFeaturedPosts(response.data.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      }
    }
    fetchedPosts();
    
 }, []);


  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked selection of quality content to inspire and inform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredPosts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/articles"
            className="inline-block px-8 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition duration-300 font-medium"
          >
            View All Articles
          </Link>
        </div>
      </div>
      
    </section>
  );
};

export default Features;