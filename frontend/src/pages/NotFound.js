import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f7ff]">
      <h1 className="text-5xl font-bold text-[#3D52A0]">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-[#8697C4]">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 bg-[#3D52A0] text-white px-4 py-2 rounded-lg hover:bg-[#7091E6] transition-colors">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;