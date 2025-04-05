import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-[#3D52A0] text-[#EDE8F5] px-4 py-4 fixed top-0 left-0 right-0 flex justify-between items-center shadow-md z-50">
            <div className="logo">
                <h1 className="m-0 text-xl font-bold">LOGO</h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-4">
                    <button className="px-4 py-2 bg-transparent text-[#EDE8F5] border border-[#EDE8F5] rounded-lg hover:bg-[#7091E6] active:bg-[#8697C4] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ADBBDA] focus:ring-opacity-50">
                        Sign In
                    </button>
                    <button className="px-4 py-2 bg-[#EDE8F5] text-[#3D52A0] border-none rounded-lg hover:bg-[#ADBBDA] active:bg-[#8697C4] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ADBBDA] focus:ring-opacity-50">
                        Sign Up
                    </button>
                </div>
                
                {isMenuOpen && (
                    <div className="absolute top-16 right-4 bg-[#3D52A0] p-4 rounded-lg shadow-lg flex flex-col gap-4 md:hidden z-50">
                        <button className="px-4 py-2 bg-transparent text-[#EDE8F5] border border-[#EDE8F5] rounded-lg hover:bg-[#7091E6] active:bg-[#8697C4] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ADBBDA] focus:ring-opacity-50">
                            Sign In
                        </button>
                        <button className="px-4 py-2 bg-[#EDE8F5] text-[#3D52A0] border-none rounded-lg hover:bg-[#ADBBDA] active:bg-[#8697C4] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ADBBDA] focus:ring-opacity-50">
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;