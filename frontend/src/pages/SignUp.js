import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Check password meets all criteria
    const passwordValid = Object.values(passwordStrength).every(Boolean);
    if (!passwordValid) {
      setError('Password does not meet all requirements');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Replace with your actual API call for registration
      // For demo purposes, we'll just simulate a successful registration
      setTimeout(() => {
        // Simulate redirect after successful registration
        navigate('/signin');
        setIsLoading(false);
      }, 1500);
      
      // Example of a real API call:
      /*
      const response = await fetch('your-api-endpoint/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Redirect to sign in or confirmation page
      navigate('/signin');
      */
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Function to check overall form validity
  const isFormValid = () => {
    return (
      formData.fullName && 
      formData.email && 
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      Object.values(passwordStrength).every(Boolean)
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#3D52A0]">Create Account</h1>
            <p className="text-[#8697C4] mt-2">Sign up to get started</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Email */}
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-[#8697C4] text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-[#ADBBDA]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
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
              
              {/* Password strength indicators */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm">
                  {passwordStrength.length ? (
                    <FaCheck className="text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="text-red-500 mr-2" />
                  )}
                  <span className={passwordStrength.length ? "text-green-600" : "text-[#8697C4]"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  {passwordStrength.hasUppercase && passwordStrength.hasLowercase ? (
                    <FaCheck className="text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="text-red-500 mr-2" />
                  )}
                  <span className={passwordStrength.hasUppercase && passwordStrength.hasLowercase ? "text-green-600" : "text-[#8697C4]"}>
                    Both uppercase and lowercase letters
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  {passwordStrength.hasNumber ? (
                    <FaCheck className="text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="text-red-500 mr-2" />
                  )}
                  <span className={passwordStrength.hasNumber ? "text-green-600" : "text-[#8697C4]"}>
                    At least one number
                  </span>
                </div>
              </div>
            </div>
            
            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-[#8697C4] text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-[#ADBBDA]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-[#ADBBDA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-transparent"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleShowConfirmPassword}
                    className="text-[#ADBBDA] hover:text-[#8697C4] focus:outline-none"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
              )}
            </div>
            
            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-[#3D52A0] text-white py-3 rounded-lg hover:bg-[#7091E6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[#8697C4]">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#7091E6] hover:text-[#3D52A0] font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;