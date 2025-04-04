import React from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { FaStar, FaCircle } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="relative h-screen">
      <Parallax pages={2}>
        {/* Background stars - slowest movement */}
        <ParallaxLayer
          offset={0}
          speed={0.05}
          factor={2}
          style={{ 
            backgroundColor: '#0a0b1a',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="text-white opacity-70" 
              style={{
                position: 'absolute',
                fontSize: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 200}%`,
                animation: `twinkle ${Math.random() * 5 + 2}s infinite alternate`,
              }}
            >
              <FaStar />
            </div>
          ))}
        </ParallaxLayer>

        {/* Floating geometric shapes - medium speed */}
        <ParallaxLayer
          offset={0.2}
          speed={0.3}
          factor={1.5}
        >
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className={`opacity-${Math.floor(Math.random() * 3 + 1) * 20}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                width: `${Math.random() * 40 + 20}px`,
                height: `${Math.random() * 40 + 20}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                background: `rgba(${Math.random() * 100 + 61}, ${Math.random() * 100 + 82}, ${Math.random() * 100 + 160}, ${Math.random() * 0.5})`,
              }}
            />
          ))}
        </ParallaxLayer>

        {/* First layer content - blue gradient */}
        <ParallaxLayer
          offset={0}
          speed={0.5}
          factor={0.7}
          style={{ 
            background: 'radial-gradient(circle, rgba(61,82,160,0.9) 0%, rgba(51,66,125,0.8) 70%, rgba(10,11,26,0) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="text-center max-w-2xl">
            <h1 className="text-white text-5xl font-bold mb-6 tracking-wide">Welcome to the Future</h1>
            <p className="text-[#EDE8F5] text-xl mb-8">
              Experience a new dimension of design with our interactive parallax effect
            </p>
            <button className="px-6 py-3 bg-[#7091E6] text-white rounded-full hover:bg-[#8697C4] transition-all duration-300">
              Explore More
            </button>
          </div>
        </ParallaxLayer>

        {/* Circular elements - fast movement */}
        <ParallaxLayer
          offset={0.4}
          speed={1.2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <div className="relative w-[500px] h-[500px]">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full border-2 border-[#ADBBDA] opacity-30"
                style={{
                  width: `${300 + i * 100}px`,
                  height: `${300 + i * 100}px`,
                  left: `${100 - i * 50}px`,
                  top: `${100 - i * 50}px`,
                }}
              />
            ))}
          </div>
        </ParallaxLayer>

        {/* Gradient fade layer between pages */}
        <ParallaxLayer
          offset={0.5}
          speed={0.8}
          style={{ 
            background: 'linear-gradient(to bottom, rgba(61, 82, 160, 0), rgba(0, 0, 0, 1))',
            height: '30vh'
          }}
        />

        {/* Second layer with sticker-like design */}
        <ParallaxLayer
          offset={1}
          speed={1}
          factor={0.7}
          style={{ 
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="relative z-10 text-center max-w-md bg-[#0a0b1a] p-8 border border-[#3D52A0] rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="absolute -z-10 w-[200px] h-[200px] bg-[#3D52A0] opacity-20 rounded-full blur-[80px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <h1 className="text-white text-3xl font-bold mb-6">Discover Innovation</h1>
            <p className="text-[#ADBBDA] text-lg mb-8">
              Our cutting-edge solutions transform ideas into reality
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="bg-[#0a0b1a] p-3 rounded-lg border border-[#3D52A0] hover:border-[#7091E6] transition-colors duration-300">
                  <FaCircle className="text-[#7091E6] text-xl mb-2 mx-auto" />
                  <h3 className="text-white font-bold text-sm mb-1">Feature {num}</h3>
                  <p className="text-xs text-gray-400">Experience the future</p>
                </div>
              ))}
            </div>
            <div className="absolute -top-3 -right-3 bg-[#7091E6] text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
          </div>
        </ParallaxLayer>
      </Parallax>

      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;