import React, { useMemo, useRef } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { FaStar, FaChartLine, FaShoppingCart, FaMobileAlt, FaServer, FaClock, FaMoneyBillWave, FaBoxOpen, FaTools, FaRegLightbulb, FaCheckCircle, FaLock, FaRegChartBar, FaDesktop } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  
  // Color palette - using these colors but for a lighter theme
  const colors = {
    darkBlue: "#3D52A0",
    lightBlue: "#7091E6",
    darkGray: "#8697C4",
    lightGray: "#ADBBDA",
    primaryWhite: "#EDE8F5",
    lightBg: "#f5f7ff"  // Light background color
  };

  // Pre-compute random values for consistent rendering
  const stars = useMemo(() => [...Array(200)].map(() => ({
    fontSize: `${Math.random() * 14 + 4}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 400}%`, 
    animationDuration: `${Math.random() * 5 + 2}s`
  })), []);

  const shapes = useMemo(() => [...Array(40)].map(() => {
    const baseColor = Math.random() > 0.5 ? colors.lightBlue : colors.darkGray;
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 400}%`, 
      rotate: `${Math.random() * 360}deg`,
      width: `${Math.random() * 120 + 50}px`,
      height: `${Math.random() * 120 + 50}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      background: `${baseColor}${Math.floor(Math.random() * 50 + 30).toString(16)}`,
      opacity: Math.random() * 0.4 + 0.1
    };
  }), []);

  const floatingLines = useMemo(() => [...Array(40)].map(() => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 400}%`,
      width: `${Math.random() * 200 + 100}px`,
      height: `${Math.random() * 3 + 1}px`,
      rotate: `${Math.random() * 180}deg`,
      opacity: Math.random() * 0.15 + 0.05,
      color: Math.random() > 0.7 ? colors.darkBlue : (Math.random() > 0.5 ? colors.lightBlue : colors.darkGray),
      animationDuration: `${Math.random() * 15 + 10}s` // 10-25s duration for slow movement
    };
  }), []);

  // Add floating orbs - large blurred circles
  const floatingOrbs = useMemo(() => [...Array(30)].map(() => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 400}%`,
      size: `${Math.random() * 200 + 100}px`, // Large orbs
      opacity: Math.random() * 0.1 + 0.05, // Very subtle
      blur: `${Math.random() * 60 + 40}px`, // Blurry effect
      color: Math.random() > 0.5 ? colors.lightBlue : colors.darkBlue,
      animationDuration: `${Math.random() * 30 + 20}s` // Very slow animation
    };
  }), []);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const featureCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6 
      }
    }
  };
  
  const benefitItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <style jsx>{`
        /* Hide scrollbar */
        :global(body::-webkit-scrollbar) {
          display: none;
        }

        :global(body) {
          -ms-overflow-style: none;
          scrollbar-width: none;
          background-color: ${colors.lightBg};
        }

        /* Star animation */
          @keyframes twinkle {
            0% { opacity: 0.4; }
            100% { opacity: 0.9; }
          }

          .star {
            position: absolute;
            animation: twinkle var(--duration) infinite alternate;
            color: ${colors.darkBlue};
          }
          
          /* Floating orb animation */
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-30px) translateX(15px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          /* Line flow animation */
          @keyframes flow {
            0% { transform: translateX(-20px) rotate(var(--rotate)); opacity: var(--min-opacity); }
            50% { transform: translateX(20px) rotate(calc(var(--rotate) + 5deg)); opacity: var(--max-opacity); }
            100% { transform: translateX(-20px) rotate(var(--rotate)); opacity: var(--min-opacity); }
          }
        
        /* Content section styling */
        .content-section {
          background-color: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(5px);
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          padding: 2rem;
        }
        
        .section-title {
          background: linear-gradient(90deg, ${colors.darkBlue}, ${colors.lightBlue});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <Parallax ref={parallaxRef} pages={4} config={{ tension: 170, friction: 26 }}>
        {/* Background with unified gradient - lighter theme */}
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={4}
          style={{ 
            background: `linear-gradient(to bottom, ${colors.lightBg} 0%, #ffffff 50%, ${colors.lightBg} 100%)`
          }}
        />
        
        {/* Glowing accent background elements - lighter versions */}
        <ParallaxLayer
          offset={0}
          speed={0.1}
          factor={4}
        >
          <div className="absolute top-[15%] left-[10%] w-96 h-96 rounded-full bg-[#7091E6] opacity-[0.07] blur-[100px]" />
          <div className="absolute top-[60%] right-[15%] w-[500px] h-[500px] rounded-full bg-[#3D52A0] opacity-[0.05] blur-[120px]" />
          <div className="absolute top-[160%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#ADBBDA] opacity-[0.08] blur-[150px]" />
          <div className="absolute top-[260%] right-[5%] w-96 h-96 rounded-full bg-[#7091E6] opacity-[0.07] blur-[100px]" />
        </ParallaxLayer>
        
        {/* Hero section */}
        <ParallaxLayer
          offset={0}
          speed={0.5}
          factor={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '70px',
          }}
        >
          <motion.div 
            className="text-center max-w-5xl px-8 py-12 relative z-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="flex justify-center mb-8" variants={iconVariants}>
              <div className="h-24 w-24 bg-white rounded-xl flex items-center justify-center shadow-lg border border-[#ADBBDA]">
                <FaChartLine className="text-6xl text-[#3D52A0]" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-[#3D52A0] text-6xl font-bold mb-6 tracking-wide"
              variants={fadeIn}
            >
              MyVendingMachine
            </motion.h1>
            
            <motion.p 
              className="text-[#8697C4] text-2xl mb-8 mx-auto max-w-3xl"
              variants={fadeIn}
            >
              Real-time monitoring and analytics for your vending machines. 
              Increase revenue, reduce costs, and make data-driven decisions.
            </motion.p>

            <motion.div 
              className="mt-16 grid grid-cols-3 gap-10"
              variants={staggerContainer}
            >
              <motion.div 
                className="flex flex-col items-center" 
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="mb-6 h-16 w-16 rounded-full bg-[#7091E6] flex items-center justify-center shadow-lg"
                  variants={iconVariants}
                >
                  <FaShoppingCart className="text-2xl text-white" />
                </motion.div>
                <h3 className="font-bold text-[#3D52A0] text-xl mb-3">Real-time Sales</h3>
                <p className="text-[#8697C4] text-lg">Track transactions as they happen</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center" 
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="mb-6 h-16 w-16 rounded-full bg-[#7091E6] flex items-center justify-center shadow-lg"
                  variants={iconVariants}
                >
                  <FaMobileAlt className="text-2xl text-white" />
                </motion.div>
                <h3 className="font-bold text-[#3D52A0] text-xl mb-3">Mobile Dashboard</h3>
                <p className="text-[#8697C4] text-lg">Access metrics from anywhere</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center" 
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="mb-6 h-16 w-16 rounded-full bg-[#7091E6] flex items-center justify-center shadow-lg"
                  variants={iconVariants}
                >
                  <FaServer className="text-2xl text-white" />
                </motion.div>
                <h3 className="font-bold text-[#3D52A0] text-xl mb-3">Cloud Storage</h3>
                <p className="text-[#8697C4] text-lg">Secure and reliable data</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </ParallaxLayer>
        
        {/* Features section */}
        <ParallaxLayer
          offset={1}
          speed={0.6}
          factor={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="max-w-6xl w-full px-8 py-16 content-section relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <span className="bg-[#3D52A0] text-white text-lg px-6 py-2 rounded-full uppercase tracking-wider shadow-sm">Features</span>
              <h2 className="section-title text-5xl font-bold mt-6 mb-6">Transforming Vending Machine Management</h2>
              <p className="text-[#8697C4] text-xl max-w-3xl mx-auto">
                Our solution provides you with comprehensive insights and control over your entire vending machine fleet.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              {/* Feature cards */}
              <motion.div 
                className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-[#ADBBDA] border-opacity-50"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-16 w-16 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-6 shadow-sm"
                  variants={iconVariants}
                >
                  <FaRegChartBar className="text-2xl text-white" />
                </motion.div>
                <h3 className="text-[#3D52A0] text-2xl font-bold mb-3">Sales Analytics</h3>
                <p className="text-[#8697C4] text-lg">Track sales by product, machine, and time period with intuitive dashboards.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-[#ADBBDA] border-opacity-50"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-16 w-16 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-6 shadow-sm"
                  variants={iconVariants}
                >
                  <FaMoneyBillWave className="text-2xl text-white" />
                </motion.div>
                <h3 className="text-[#3D52A0] text-2xl font-bold mb-3">Revenue Tracking</h3>
                <p className="text-[#8697C4] text-lg">Monitor cash flow and profitability across all your vending locations.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-[#ADBBDA] border-opacity-50"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-16 w-16 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-6 shadow-sm"
                  variants={iconVariants}
                >
                  <FaBoxOpen className="text-2xl text-white" />
                </motion.div>
                <h3 className="text-[#3D52A0] text-2xl font-bold mb-3">Inventory Management</h3>
                <p className="text-[#8697C4] text-lg">Know exactly when products need restocking to maximize sales opportunities.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-[#ADBBDA] border-opacity-50"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-16 w-16 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-6 shadow-sm"
                  variants={iconVariants}
                >
                  <FaTools className="text-2xl text-white" />
                </motion.div>
                <h3 className="text-[#3D52A0] text-2xl font-bold mb-3">Maintenance Alerts</h3>
                <p className="text-[#8697C4] text-lg">Receive real-time notifications about machine issues before they impact sales.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-[#ADBBDA] border-opacity-50"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-16 w-16 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-6 shadow-sm"
                  variants={iconVariants}
                >
                  <FaDesktop className="text-2xl text-white" />
                </motion.div>
                <h3 className="text-[#3D52A0] text-2xl font-bold mb-3">User-Friendly Interface</h3>
                <p className="text-[#8697C4] text-lg">Access all features through an intuitive dashboard designed for easy navigation.</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl p-8 hover:shadow-xl transition duration-300 border border-[#ADBBDA] border-opacity-50"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-16 w-16 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-6 shadow-sm"
                  variants={iconVariants}
                >
                  <FaLock className="text-2xl text-white" />
                </motion.div>
                <h3 className="text-[#3D52A0] text-2xl font-bold mb-3">Data Security</h3>
                <p className="text-[#8697C4] text-lg">Enterprise-grade security ensures your business data remains protected.</p>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              {/* Add your button here if needed */}
            </motion.div>
          </div>
        </ParallaxLayer>

        {/* How It Works section */}
        <ParallaxLayer
          offset={2}
          speed={0.6}
          factor={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="max-w-6xl w-full px-8 py-16 content-section relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <span className="bg-[#3D52A0] text-white text-lg px-6 py-2 rounded-full uppercase tracking-wider shadow-sm">How It Works</span>
              <h2 className="section-title text-5xl font-bold mt-6 mb-6">Simple Integration, Powerful Results</h2>
              <p className="text-[#8697C4] text-xl max-w-3xl mx-auto">
                Our plug-and-play solution makes it easy to start monitoring your vending machines in minutes.
              </p>
            </motion.div>

            {/* Steps section */}
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#ADBBDA] transform -translate-x-1/2"></div>

              {/* Step 1 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
              >
                <div className="md:w-1/2 md:pr-16 text-right">
                  <h3 className="text-[#3D52A0] text-3xl font-bold mb-4">Install the Module</h3>
                  <p className="text-[#8697C4] text-xl">Connect our monitoring module to your existing vending machines with a simple plug-and-play installation.</p>
                </div>
                <motion.div 
                  className="rounded-full bg-[#7091E6] text-white h-16 w-16 flex items-center justify-center font-bold text-2xl my-4 md:my-0 z-10 shadow-lg"
                  variants={iconVariants}
                >
                  1
                </motion.div>
                <div className="md:w-1/2 md:pl-16 hidden md:block"></div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
              >
                <div className="md:w-1/2 md:pr-16 hidden md:block"></div>
                <motion.div 
                  className="rounded-full bg-[#7091E6] text-white h-16 w-16 flex items-center justify-center font-bold text-2xl my-4 md:my-0 z-10 shadow-lg"
                  variants={iconVariants}
                >
                  2
                </motion.div>
                <div className="md:w-1/2 md:pl-16">
                  <h3 className="text-[#3D52A0] text-3xl font-bold mb-4">Activate the Service</h3>
                  <p className="text-[#8697C4] text-xl">Register your device in our system and start receiving data immediately on our secure platform.</p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
              >
                <div className="md:w-1/2 md:pr-16 text-right">
                  <h3 className="text-[#3D52A0] text-3xl font-bold mb-4">Monitor Performance</h3>
                  <p className="text-[#8697C4] text-xl">Access real-time data through our web dashboard or mobile app to track sales and inventory.</p>
                </div>
                <motion.div 
                  className="rounded-full bg-[#7091E6] text-white h-16 w-16 flex items-center justify-center font-bold text-2xl my-4 md:my-0 z-10 shadow-lg"
                  variants={iconVariants}
                >
                  3
                </motion.div>
                <div className="md:w-1/2 md:pl-16 hidden md:block"></div>
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
              >
                <div className="md:w-1/2 md:pr-16 hidden md:block"></div>
                <motion.div 
                  className="rounded-full bg-[#7091E6] text-white h-16 w-16 flex items-center justify-center font-bold text-2xl my-4 md:my-0 z-10 shadow-lg"
                  variants={iconVariants}
                >
                  4
                </motion.div>
                <div className="md:w-1/2 md:pl-16">
                  <h3 className="text-[#3D52A0] text-3xl font-bold mb-4">Optimize Your Business</h3>
                  <p className="text-[#8697C4] text-xl">Use analytics to make data-driven decisions and grow your vending machine business effectively.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </ParallaxLayer>
        
        {/* Business Model section */}
        <ParallaxLayer
          offset={3}
          speed={0.6}
          factor={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="z-50 relative max-w-6xl w-full px-8 py-20 content-section "> {/* Increased padding */}
            <motion.div 
              className="text-center mb-20" /* Increased spacing */
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <h2 className="section-title text-6xl font-bold mt-8 mb-8">Pay Only For Success</h2> {/* Increased size and spacing */}
              <p className="text-[#8697C4] text-2xl max-w-3xl mx-auto"> {/* Increased size */}
                Our innovative approach means you only pay for what works. The device is your only upfront cost.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
            >
              {/* Card 1: One-time payment */}
              <motion.div 
                className="bg-gradient-to-tr from-[#f5f7ff] to-white rounded-xl border border-[#ADBBDA] overflow-hidden shadow-lg"
                variants={fadeIn}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="p-8">
                  <div className="rounded-full bg-[#EDE8F5] w-16 h-16 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3D52A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#3D52A0] mb-4">One-Time Device Fee</h3>
                  <p className="text-[#8697C4] mb-6">Pay only once for the hardware device. No monthly subscriptions or hidden fees.</p>
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-[#3D52A0]">$40</p>
                    <p className="text-[#8697C4] text-sm">per device, one-time payment</p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Success-based fee */}
              <motion.div 
                className="bg-gradient-to-br from-[#3D52A0] to-[#2A3973] rounded-xl overflow-hidden shadow-xl"
                variants={fadeIn}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="p-8">
                  <div className="rounded-full bg-white bg-opacity-20 w-16 h-16 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Success-Based Model</h3>
                  <p className="text-[#EDE8F5] opacity-90 mb-6">We only earn when you earn more. Our fee is a small percentage of the additional profits we help you generate.</p>
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-white flex items-center">
                      5%
                      <span className="text-lg ml-2 opacity-80">of bonus profits</span>
                    </p>
                    <p className="text-[#EDE8F5] opacity-70 text-sm">Only applied to increased revenue</p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Platform Access */}
              <motion.div 
                className="bg-gradient-to-tr from-[#f5f7ff] to-white rounded-xl border border-[#ADBBDA] overflow-hidden shadow-lg"
                variants={fadeIn}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="p-8">
                  <div className="rounded-full bg-[#EDE8F5] w-16 h-16 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3D52A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#3D52A0] mb-4">Platform & Analytics</h3>
                  <p className="text-[#8697C4] mb-6">Full access to our advanced analytics dashboard and management tools at no additional cost.</p>
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-[#3D52A0]">Free</p>
                    <p className="text-[#8697C4] text-sm">unlimited access to all features</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-16 flex flex-col items-center" /* Increased spacing */
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <p className="text-[#8697C4] text-xl max-w-3xl mx-auto mb-8 text-center"> 
                Ready to transform your vending machine business with our risk-free approach? 
                Check out our device specifications and see how easy it is to get started.
              </p>
            </motion.div>
          </div>
        </ParallaxLayer>
        

        {/* Decorative stars - spans all pages */}
        <ParallaxLayer offset={0} speed={0.1} factor={4}>
          {stars.map((star, i) => (
            <div 
              key={i}
              className="star" 
              style={{
                fontSize: star.fontSize,
                left: star.left,
                top: star.top,
                '--duration': star.animationDuration
              }}
            >
              <FaStar />
            </div>
          ))}
        </ParallaxLayer> 
        
        {/* Floating shapes with motion */}
        <ParallaxLayer offset={0} speed={0.2} factor={4}>
          {shapes.map((shape, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: shape.opacity,
                y: [0, Math.random() > 0.5 ? 25 : -25, 0],
              }}
              transition={{ 
                opacity: { duration: 2, delay: i * 0.1 },
                y: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
              style={{
                position: 'absolute',
                left: shape.left,
                top: shape.top,
                transform: `rotate(${shape.rotate})`,
                width: shape.width,
                height: shape.height,
                borderRadius: shape.borderRadius,
                background: shape.background,
              }}
            />
          ))}
        </ParallaxLayer>
        
        {/* Floating Orbs Layer */}
        <ParallaxLayer offset={0} speed={0.15} factor={4}>
          {floatingOrbs.map((orb, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                left: orb.left,
                top: orb.top,
                width: orb.size,
                height: orb.size,
                backgroundColor: orb.color,
                opacity: orb.opacity,
                borderRadius: '50%',
                filter: `blur(${orb.blur})`,
                animation: `float ${orb.animationDuration} infinite ease-in-out`
              }}
            />
          ))}
        </ParallaxLayer>

        {/* Flowing Lines Layer */}
        <ParallaxLayer offset={0} speed={0.2} factor={4}>
          {floatingLines.map((line, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                left: line.left,
                top: line.top,
                width: line.width,
                height: line.height,
                backgroundColor: line.color,
                opacity: line.opacity,
                transform: `rotate(${line.rotate})`,
                animation: `flow ${line.animationDuration} infinite ease-in-out`,
                '--min-opacity': line.opacity * 0.5,
                '--max-opacity': line.opacity * 1.5,
                '--rotate': line.rotate
              }}
            />
          ))}
        </ParallaxLayer>
        
        {/* Navigation indicators */}
        <ParallaxLayer 
          sticky={{ start: 0, end: 4 }}
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '2rem', zIndex: 1 }}
        >
          <div className="hidden md:flex flex-col gap-4">
            {[0, 1, 2, 3].map((page) => (
              <motion.div
                key={page}
                className={`h-4 w-4 rounded-full cursor-pointer ${parallaxRef.current && Math.round(parallaxRef.current.current) === page ? 'bg-[#3D52A0]' : 'bg-[#ADBBDA]'}`}
                whileHover={{ scale: 1.5 }}
                onClick={() => parallaxRef.current?.scrollTo(page)}
              />
            ))}
          </div>
        </ParallaxLayer>
      </Parallax>
      {/* Fixed action button that sits above all Parallax layers */}
<div className="fixed bottom-10 right-10 z-[9999]">
  <a 
    href="/product" 
    className="bg-[#3D52A0] text-white px-10 py-5 rounded-xl text-xl font-medium hover:bg-[#7091E6] transition-all shadow-lg flex items-center"
  >
    Get Started
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </a>
</div>
    </div>
  );
};

export default HomePage;