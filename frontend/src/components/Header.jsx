import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';

function Header() {
  const authStatus = useSelector((state) => state.auth.isActive);
  
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true
    },
    {
      name: "Articles",
      slug: "/articles",
      active: true
    },
    {
      name: "Your Blogs",
      slug: "/user-blogs",
      active: authStatus
    },
    {
      name: "Create Blog",
      slug: "/write-blog",
      active: authStatus
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus
    }
  ];

  return (
    <header className='w-full bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          {/* Logo/Brand */}
          <Link to="/" className='flex items-center'>
            <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent'>
              BlogWave
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className='hidden md:flex items-center space-x-1'>
            {navItems.map((item) => 
              item.active && (
                <Link 
                  key={item.name} 
                  to={item.slug}  
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    item.slug === window.location.pathname 
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            {authStatus && (
              <div className='ml-2'>
                <Logout />
              </div>
            )}
          </nav>

          {/* Mobile menu button (you can implement mobile menu functionality later) */}
          <div className='md:hidden flex items-center'>
            <button 
              type='button' 
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu</span>
              <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;