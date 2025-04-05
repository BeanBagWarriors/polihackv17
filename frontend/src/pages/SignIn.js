import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthContext } from '../Hooks/useAuthContext.js';

const SignIn = () => {
  const { dispatch } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const response = await fetch(`${process.env.REACT_APP_API}/api/user/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });
    
    const json = await response.json();

    if(!response.ok){
      console.log(json.error);
      setError(json.error);
      setIsLoading(false);
    }
    
    if(response.ok){
      localStorage.setItem('user', JSON.stringify(json));
      dispatch({type: 'LOGIN', payload: json});
      setIsLoading(false);
      navigate('/dashboard');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#3D52A0]">Welcome Back</h1>
            <p className="text-[#8697C4] mt-2">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-[#8697C4] text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-[#ADBBDA]" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-[#8697C4] text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-[#7091E6] hover:text-[#3D52A0]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-[#ADBBDA]" />
                </div>
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-transparent"
                    placeholder="••••••••"
                    />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="text-[#ADBBDA] hover:text-[#8697C4] focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#7091E6] focus:ring-[#7091E6] border-[#ADBBDA] rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#8697C4]">
                Remember me
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#3D52A0] text-white py-3 rounded-lg hover:bg-[#7091E6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:ring-opacity-50 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[#8697C4]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#7091E6] hover:text-[#3D52A0] font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;