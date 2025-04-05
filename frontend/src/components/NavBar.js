import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaCog, FaChartLine, FaSignOutAlt, FaBell } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useAuthContext } from '../Hooks/useAuthContext';
import { useLogout } from '../Hooks/useLogout';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // Close other menus when opening this one
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        // Close other menus when opening this one
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
        // Close other menus when opening this one
        setIsMenuOpen(false);
        setIsNotificationsOpen(false);
    };

    const navigateToDashboard = () => {
        navigate('/dashboard');
    };

    
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
            const response = await fetch(`${process.env.REACT_APP_API}/api/user/getNotifications/${user.username}`,{
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                }
            });
            
            const json = await response.json();

            if (response.ok) {
                setNotifications(json.notifications);
                console.log('Notifications fetched successfully:', json);
            }

            if(!response.ok) {
                console.error('Failed to fetch notifications:', json.error);
            }
        }

    useEffect(() => {
        if(user)
            fetchNotifications();
    }, [user]);

    return (
        <nav className="fixed top-0 left-0 w-full h-[80px] bg-[#3D52A0] shadow-md z-50 px-4 lg:px-8 flex items-center justify-between">
            {/* Logo & Navigation Items */}
            <div className="flex items-center gap-8">
                <button 
                    onClick={navigateToDashboard}
                    className="flex items-center mb-2 focus:outline-none hover:opacity-80 transition-opacity text-white font-bold text-2xl"
                >
                    MyVendingMachine
                </button>
                
                {/* Desktop Navigation Items */}
                {user &&
                    <div className="hidden lg:flex items-center gap-6">
                        <Link to="/dashboard" className="text-[#EDE8F5] hover:text-white transition-colors">Dashboard</Link>
                        <Link to="/analytics" className="text-[#EDE8F5] hover:text-white transition-colors">Analytics</Link>
                    </div>
                }
            </div>
            
            {/* Right Side - User Controls */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                {user &&
                <div className="relative">
                    <button 
                        className="relative p-2 rounded-full hover:bg-[#7091E6] focus:outline-none focus:ring-2 focus:ring-[#ADBBDA] transition-all"
                        onClick={toggleNotifications}
                    >
                        <FaBell className="text-[#EDE8F5] text-xl" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </button>
                    {/* Notifications Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-200">
                                <h3 className="font-bold text-[#3D52A0]">Notifications</h3>
                            </div>
                            
                            {notifications.length > 0 ? (
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map(notification => (
                                        <div key={notification.id} className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100">
                                            <div className='flex flex-row gap-1'>
                                                <p className="text-sm text-[#3D52A0] font-semibold">{notification.type}:</p>
                                                <p className="text-sm text-[#3D52A0]">{notification.message}</p>
                                            </div>
                                            <p className="text-xs text-[#8697C4] mt-1">{notification.date}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-2 text-center text-[#8697C4]">
                                    No new notifications
                                </div>
                            )}
                            
                            <div className="px-4 py-2 border-t border-gray-200">
                                <Link to="/notifications" className="text-sm text-[#7091E6] hover:text-[#3D52A0]">
                                    View all notifications
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                }   
                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ADBBDA] transition-all"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? (
                        <FaTimes className="text-[#EDE8F5] text-xl" />
                    ) : (
                        <FaBars className="text-[#EDE8F5] text-xl" />
                    )}
                </button>
                
                {/* Sign In/Up Buttons (Desktop) */}
                {!user ?
                <div className="hidden md:flex gap-4">
                    <button 
                        onClick={() => navigate('/signin')}
                        className="px-4 py-2 bg-transparent text-[#EDE8F5] border border-[#EDE8F5] rounded-lg hover:bg-[#7091E6] active:bg-[#8697C4] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ADBBDA] focus:ring-opacity-50"
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => navigate('/signup')}
                        className="px-4 py-2 bg-[#EDE8F5] text-[#3D52A0] border-none rounded-lg hover:bg-[#ADBBDA] active:bg-[#8697C4] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ADBBDA] focus:ring-opacity-50"
                    >
                        Sign Up
                    </button>
                </div>
                : 
                <div className="relative">
                    <button 
                        onClick={toggleProfileMenu}
                        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[#7091E6] rounded-lg transition-all"
                    >
                        <span>{user.username}</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                            <button 
                                onClick={() => {
                                    navigate('/signin');
                                    logout();
                                }}
                                className="w-full text-left px-4 py-2 text-[#3D52A0] hover:bg-gray-50 flex items-center gap-2"
                            >
                                <FaSignOutAlt className="text-sm" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
                }
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-[80px] left-0 right-0 bg-[#3D52A0] p-4 shadow-lg md:hidden z-40 border-t border-[#7091E6]">
                    <div className="flex flex-col gap-3">
                        <Link to="/dashboard" className="text-[#EDE8F5] hover:text-white py-2 px-4 rounded-lg hover:bg-[#7091E6] transition-all">Dashboard</Link>
                        <Link to="/analytics" className="text-[#EDE8F5] hover:text-white py-2 px-4 rounded-lg hover:bg-[#7091E6] transition-all">Analytics</Link>
                        <Link to="/machines" className="text-[#EDE8F5] hover:text-white py-2 px-4 rounded-lg hover:bg-[#7091E6] transition-all">Machines</Link>
                        <Link to="/inventory" className="text-[#EDE8F5] hover:text-white py-2 px-4 rounded-lg hover:bg-[#7091E6] transition-all">Inventory</Link>
                        <div className="border-t border-[#7091E6] my-2 py-2">
                            <Link to="/profile" className="text-[#EDE8F5] hover:text-white py-2 px-4 rounded-lg hover:bg-[#7091E6] transition-all flex items-center gap-2">
                                <FaUser /> My Profile
                            </Link>
                            <Link to="/settings" className="text-[#EDE8F5] hover:text-white py-2 px-4 rounded-lg hover:bg-[#7091E6] transition-all flex items-center gap-2">
                                <FaCog /> Settings
                            </Link>
                            <Link to="/logout" className="text-[#EDE8F5] hover:text-white py-2 px-4 rounded-lg hover:bg-[#7091E6] transition-all flex items-center gap-2">
                                <FaSignOutAlt /> Logout
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <button 
                                onClick={() => navigate('/signin')}
                                className="px-4 py-2 bg-transparent text-[#EDE8F5] border border-[#EDE8F5] rounded-lg hover:bg-[#7091E6] active:bg-[#8697C4] transition-all focus:outline-none"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => navigate('/signup')}
                                className="px-4 py-2 bg-[#EDE8F5] text-[#3D52A0] border-none rounded-lg hover:bg-[#ADBBDA] active:bg-[#8697C4] transition-all focus:outline-none"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;