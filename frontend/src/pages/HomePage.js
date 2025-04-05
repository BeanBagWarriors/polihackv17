import React, { useMemo, useRef } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { FaStar, FaChartLine, FaShoppingCart, FaMobileAlt, FaServer, FaClock, FaMoneyBillWave, FaBoxOpen, FaTools, FaRegLightbulb, FaCheckCircle, FaLock, FaRegChartBar, FaDesktop } from 'react-icons/fa';

const HomePage = () => {
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

  // Pre-compute random values for consistent rendering - more stars
  const stars = useMemo(() => [...Array(60)].map(() => ({
    fontSize: `${Math.random() * 10 + 3}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 400}%`, 
    animationDuration: `${Math.random() * 5 + 2}s`
  })), []);

  const shapes = useMemo(() => [...Array(12)].map(() => {
    // Use our color palette for shapes
    const baseColor = Math.random() > 0.5 ? colors.lightBlue : colors.darkGray;
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 400}%`, 
      rotate: `${Math.random() * 360}deg`,
      width: `${Math.random() * 50 + 30}px`,
      height: `${Math.random() * 50 + 30}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      background: `${baseColor}${Math.floor(Math.random() * 50 + 30).toString(16)}`,
      opacity: Math.random() * 0.4 + 0.1
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
  
  // Navigation functions
  const scrollToSection = (page) => {
    if (parallaxRef.current) {
      parallaxRef.current.scrollTo(page);
    }
  };

  // Handle button clicks
  const handleRequestDemo = () => {
    window.location.href = "mailto:sales@vendingintelligence.com?subject=Demo Request";
  };

  const handleLearnMore = () => {
    scrollToSection(1);
  };

  const handleContactSales = () => {
    window.location.href = "tel:+1234567890";
  };

  const handleGetStarted = () => {
    window.location.href = "https://vendingintelligence.com/signup";
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
          color: ${colors.darkBlue}; /* Darker stars on light background */
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
              Vending Intelligence Suite
            </motion.h1>
            
            <motion.p 
              className="text-[#8697C4] text-2xl mb-8 mx-auto max-w-3xl"
              variants={fadeIn}
            >
              Real-time monitoring and analytics for your vending machines. 
              Increase revenue, reduce costs, and make data-driven decisions.
            </motion.p>
            
            <motion.div 
              className="flex justify-center gap-6"
              variants={fadeIn}
            >
            </motion.div>

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
            
            <motion.div 
              className="mt-16 flex justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
             
            </motion.div>
          </div>
        </ParallaxLayer>
        
        {/* Pricing section */}
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
          <div className="max-w-6xl w-full px-8 py-16 content-section relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <span className="bg-[#3D52A0] text-white text-lg px-6 py-2 rounded-full uppercase tracking-wider shadow-sm">Pricing</span>
              <h2 className="section-title text-5xl font-bold mt-6 mb-6">Simple, Affordable Pricing</h2>
              <p className="text-[#8697C4] text-xl max-w-3xl mx-auto">
                Start monitoring your vending machines with our cost-effective solution, designed to deliver value from day one.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-[#3D52A0] to-[#2A3973] rounded-xl overflow-hidden shadow-xl max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#ADBBDA] text-lg uppercase tracking-wider font-medium">Standard Plan</p>
                    <h3 className="text-white text-3xl font-bold">Complete Solution</h3>
                  </div>
                  <motion.div 
                    className="bg-[#7091E6] h-16 w-16 rounded-full flex items-center justify-center shadow-lg"
                    variants={iconVariants}
                    whileHover={{ rotate: 15 }}
                  >
                    <FaRegLightbulb className="text-3xl text-white" />
                  </motion.div>
                </div>

                <div className="flex flex-wrap items-end mb-6">
                  <div className="mr-10 mb-4">
                    <p className="text-[#ADBBDA] text-base mb-1">Initial Cost</p>
                    <div className="flex items-end">
                      <span className="text-white text-4xl font-bold">$10</span>
                      <span className="text-[#ADBBDA] ml-2 pb-1">for device + first month</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-[#ADBBDA] text-base mb-1">Monthly Fee</p>
                    <div className="flex items-end">
                      <span className="text-white text-4xl font-bold">$8</span>
                      <span className="text-[#ADBBDA] ml-2 pb-1">/month thereafter</span>
                    </div>
                  </div>
                </div>

                <motion.div 
                  className="bg-[rgba(255,255,255,0.1)] p-5 rounded-lg mb-6"
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white text-xl font-bold">Optional Analytics Module</h4>
                      <p className="text-[#ADBBDA] text-sm mt-1">Enhanced analytics and reporting capabilities</p>
                    </div>
                    <div>
                      <span className="text-white text-2xl font-bold">+$5</span>
                      <span className="text-[#ADBBDA] text-sm ml-1">/month</span>
                    </div>
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h5 className="text-white text-lg font-bold mb-3">Standard Features</h5>
                    <ul className="text-[#EDE8F5] space-y-3">
                      <li className="flex items-center">
                        <FaCheckCircle className="text-[#7091E6] mr-3 flex-shrink-0" size={18} />
                        <span>Real-time sales monitoring</span>
                      </li>
                      <li className="flex items-center">
                        <FaCheckCircle className="text-[#7091E6] mr-3 flex-shrink-0" size={18} />
                        <span>Inventory tracking</span>
                      </li>
                      <li className="flex items-center">
                        <FaCheckCircle className="text-[#7091E6] mr-3 flex-shrink-0" size={18} />
                        <span>Mobile dashboard access</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white text-lg font-bold mb-3">Support & Security</h5>
                    <ul className="text-[#EDE8F5] space-y-3">
                      <li className="flex items-center">
                        <FaCheckCircle className="text-[#7091E6] mr-3 flex-shrink-0" size={18} />
                        <span>Basic reporting</span>
                      </li>
                      <li className="flex items-center">
                        <FaCheckCircle className="text-[#7091E6] mr-3 flex-shrink-0" size={18} />
                        <span>Email support</span>
                      </li>
                      <li className="flex items-center">
                        <FaCheckCircle className="text-[#7091E6] mr-3 flex-shrink-0" size={18} />
                        <span>Cloud data storage</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-[#ADBBDA] text-sm text-center mt-6">
                  No contracts. Cancel anytime. All prices exclude applicable taxes.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
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
                y: [0, Math.random() > 0.5 ? 15 : -15, 0],
              }}
              transition={{ 
                opacity: { duration: 2, delay: i * 0.2 },
                y: { duration: Math.random() * 5 + 8, repeat: Infinity, ease: "easeInOut" }
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
        
        {/* Navigation indicators */}
        <ParallaxLayer 
          sticky={{ start: 0, end: 4 }}
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '2rem' }}
        >
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default HomePage;