import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Discover & Share <span className="text-indigo-600">Thought-Provoking</span> Articles
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of readers and writers exploring ideas that matter in technology, lifestyle, and personal growth.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/articles"
                className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 text-center font-medium"
              >
                Explore Articles
              </Link>
              <Link
                to="/write-blog"
                className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition duration-300 text-center font-medium"
              >
                Start Writing
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Person reading a book" 
              className="rounded-lg shadow-xl w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;