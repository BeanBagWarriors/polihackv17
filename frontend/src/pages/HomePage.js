import React, { useMemo } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { FaStar, FaChartLine, FaShoppingCart, FaMobileAlt, FaServer, FaClock, FaMoneyBillWave, FaBoxOpen, FaTools, FaRegLightbulb, FaCheckCircle, FaLock, FaRegChartBar, FaDesktop } from 'react-icons/fa';

const HomePage = () => {
  // Color palette
  const colors = {
    darkBlue: "#3D52A0",
    lightBlue: "#7091E6",
    darkGray: "#8697C4",
    lightGray: "#ADBBDA",
    primaryWhite: "#EDE8F5"
  };

  // Pre-compute random values for consistent rendering
  const stars = useMemo(() => [...Array(30)].map(() => ({
    fontSize: `${Math.random() * 8 + 3}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 500}%`, // Spread across all pages
    animationDuration: `${Math.random() * 5 + 2}s`
  })), []);

  const shapes = useMemo(() => [...Array(8)].map(() => {
    // Use our color palette for shapes
    const baseColor = Math.random() > 0.5 ? colors.lightBlue : colors.darkGray;
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 500}%`, // Spread across all pages
      rotate: `${Math.random() * 360}deg`,
      width: `${Math.random() * 40 + 20}px`,
      height: `${Math.random() * 40 + 20}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      background: `${baseColor}${Math.floor(Math.random() * 50 + 30).toString(16)}`, // Add transparency
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
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
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
        }

        /* Star animation */
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }

        .star {
          position: absolute;
          animation: twinkle var(--duration) infinite alternate;
          color: ${colors.primaryWhite};
        }
      `}</style>

      <Parallax pages={5}>
        {/* Background layer - spans all pages */}
        <ParallaxLayer
          offset={0}
          speed={0.1}
          factor={5}
          style={{ 
            backgroundColor: '#0a0b1a',
          }}
        />
        
        {/* Hero section - exactly 1 page */}
        <ParallaxLayer
          offset={0}
          speed={0.6}
          factor={1}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `radial-gradient(circle at 50% 50%, ${colors.darkBlue}99 0%, ${colors.darkBlue}66 70%, transparent 100%)`,
          }}
        >
          <motion.div 
            className="text-center max-w-4xl p-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="mb-8 flex justify-center" variants={iconVariants}>
              <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <FaChartLine className="text-4xl text-[#3D52A0]" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-white text-5xl font-bold mb-6 tracking-wide"
              variants={fadeIn}
            >
              Vending Intelligence Suite
            </motion.h1>
            
            <motion.p 
              className="text-[#EDE8F5] text-xl mb-8"
              variants={fadeIn}
            >
              Real-time monitoring and analytics for your vending machines. 
              Increase revenue, reduce costs, and make data-driven decisions.
            </motion.p>
            
            <motion.div 
              className="flex justify-center gap-4"
              variants={fadeIn}
            >
              <motion.button 
                className="px-6 py-3 bg-[#7091E6] text-white rounded-lg hover:bg-[#8697C4] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request Demo
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-transparent text-white border border-white rounded-lg hover:bg-white hover:text-[#3D52A0] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            <motion.div 
              className="mt-16 grid grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              <motion.div 
                className="flex flex-col items-center" 
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="mb-4 h-12 w-12 rounded-full bg-[#7091E6] flex items-center justify-center"
                  variants={iconVariants}
                >
                  <FaShoppingCart className="text-white text-xl" />
                </motion.div>
                <h3 className="font-bold text-[#EDE8F5] mb-2">Real-time Sales</h3>
                <p className="text-[#ADBBDA] text-sm">Track transactions as they happen</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center" 
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="mb-4 h-12 w-12 rounded-full bg-[#7091E6] flex items-center justify-center"
                  variants={iconVariants}
                >
                  <FaMobileAlt className="text-white text-xl" />
                </motion.div>
                <h3 className="font-bold text-[#EDE8F5] mb-2">Mobile Dashboard</h3>
                <p className="text-[#ADBBDA] text-sm">Access metrics from anywhere</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center" 
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="mb-4 h-12 w-12 rounded-full bg-[#7091E6] flex items-center justify-center"
                  variants={iconVariants}
                >
                  <FaServer className="text-white text-xl" />
                </motion.div>
                <h3 className="font-bold text-[#EDE8F5] mb-2">Cloud Storage</h3>
                <p className="text-[#ADBBDA] text-sm">Secure and reliable data</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </ParallaxLayer>
        
        {/* Features section - exactly 1 page */}
        <ParallaxLayer
          offset={1.0}
          speed={0.6}
          factor={1}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="max-w-5xl w-full px-8">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <span className="bg-[#7091E6] text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider">Features</span>
              <h2 className="text-white text-4xl font-bold mt-4 mb-4">Transforming Vending Machine Management</h2>
              <p className="text-[#ADBBDA] text-lg max-w-2xl mx-auto">
                Our solution provides you with comprehensive insights and control over your entire vending machine fleet.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.div 
                className="bg-[#1a1e35] rounded-lg p-6 hover:shadow-lg transition duration-300"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-12 w-12 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-4"
                  variants={iconVariants}
                >
                  <FaRegChartBar className="text-white text-xl" />
                </motion.div>
                <h3 className="text-white text-xl font-bold mb-2">Sales Analytics</h3>
                <p className="text-[#ADBBDA]">Track sales by product, machine, and time period with intuitive dashboards.</p>
              </motion.div>
              
              <motion.div 
                className="bg-[#1a1e35] rounded-lg p-6 hover:shadow-lg transition duration-300"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-12 w-12 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-4"
                  variants={iconVariants}
                >
                  <FaMoneyBillWave className="text-white text-xl" />
                </motion.div>
                <h3 className="text-white text-xl font-bold mb-2">Revenue Tracking</h3>
                <p className="text-[#ADBBDA]">Monitor cash flow and profitability across all your vending locations.</p>
              </motion.div>
              
              <motion.div 
                className="bg-[#1a1e35] rounded-lg p-6 hover:shadow-lg transition duration-300"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-12 w-12 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-4"
                  variants={iconVariants}
                >
                  <FaBoxOpen className="text-white text-xl" />
                </motion.div>
                <h3 className="text-white text-xl font-bold mb-2">Inventory Management</h3>
                <p className="text-[#ADBBDA]">Know exactly when products need restocking to maximize sales opportunities.</p>
              </motion.div>
              
              <motion.div 
                className="bg-[#1a1e35] rounded-lg p-6 hover:shadow-lg transition duration-300"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-12 w-12 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-4"
                  variants={iconVariants}
                >
                  <FaTools className="text-white text-xl" />
                </motion.div>
                <h3 className="text-white text-xl font-bold mb-2">Maintenance Alerts</h3>
                <p className="text-[#ADBBDA]">Receive real-time notifications about machine issues before they impact sales.</p>
              </motion.div>
              
              <motion.div 
                className="bg-[#1a1e35] rounded-lg p-6 hover:shadow-lg transition duration-300"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-12 w-12 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-4"
                  variants={iconVariants}
                >
                  <FaDesktop className="text-white text-xl" />
                </motion.div>
                <h3 className="text-white text-xl font-bold mb-2">User-Friendly Interface</h3>
                <p className="text-[#ADBBDA]">Access all features through an intuitive dashboard designed for easy navigation.</p>
              </motion.div>
              
              <motion.div 
                className="bg-[#1a1e35] rounded-lg p-6 hover:shadow-lg transition duration-300"
                variants={featureCardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-12 w-12 rounded-lg bg-[#3D52A0] flex items-center justify-center mb-4"
                  variants={iconVariants}
                >
                  <FaLock className="text-white text-xl" />
                </motion.div>
                <h3 className="text-white text-xl font-bold mb-2">Data Security</h3>
                <p className="text-[#ADBBDA]">Enterprise-grade security ensures your business data remains protected.</p>
              </motion.div>
            </motion.div>
          </div>
        </ParallaxLayer>
        
        {/* How it works - exactly 1 page */}
        <ParallaxLayer
          offset={2.0}
          speed={0.6}
          factor={1}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="max-w-5xl w-full px-8">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <span className="bg-[#7091E6] text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider">How It Works</span>
              <h2 className="text-white text-4xl font-bold mt-4 mb-4">Simple Integration, Powerful Results</h2>
              <p className="text-[#ADBBDA] text-lg max-w-2xl mx-auto">
                Our plug-and-play solution makes it easy to start monitoring your vending machines in minutes.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#3D52A0] transform -translate-x-1/2"></div>

              {/* Step 1 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
              >
                <div className="md:w-1/2 md:pr-12 text-right">
                  <h3 className="text-white text-2xl font-bold mb-2">Install the Module</h3>
                  <p className="text-[#ADBBDA]">Connect our monitoring module to your existing vending machines with a simple plug-and-play installation.</p>
                </div>
                <motion.div 
                  className="rounded-full bg-[#3D52A0] text-white h-12 w-12 flex items-center justify-center font-bold my-4 md:my-0 z-10"
                  variants={iconVariants}
                >
                  1
                </motion.div>
                <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
              >
                <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                <motion.div 
                  className="rounded-full bg-[#3D52A0] text-white h-12 w-12 flex items-center justify-center font-bold my-4 md:my-0 z-10"
                  variants={iconVariants}
                >
                  2
                </motion.div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-white text-2xl font-bold mb-2">Activate the Service</h3>
                  <p className="text-[#ADBBDA]">Register your device in our system and start receiving data immediately on our secure platform.</p>
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
                <div className="md:w-1/2 md:pr-12 text-right">
                  <h3 className="text-white text-2xl font-bold mb-2">Monitor Performance</h3>
                  <p className="text-[#ADBBDA]">Access real-time data through our web dashboard or mobile app to track sales and inventory.</p>
                </div>
                <motion.div 
                  className="rounded-full bg-[#3D52A0] text-white h-12 w-12 flex items-center justify-center font-bold my-4 md:my-0 z-10"
                  variants={iconVariants}
                >
                  3
                </motion.div>
                <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
              >
                <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                <motion.div 
                  className="rounded-full bg-[#3D52A0] text-white h-12 w-12 flex items-center justify-center font-bold my-4 md:my-0 z-10"
                  variants={iconVariants}
                >
                  4
                </motion.div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-white text-2xl font-bold mb-2">Optimize Your Business</h3>
                  <p className="text-[#ADBBDA]">Use analytics to make data-driven decisions and grow your vending machine business effectively.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Benefits section - exactly 1 page */}
        <ParallaxLayer
          offset={3.0}
          speed={0.6}
          factor={1}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `radial-gradient(circle at 50% 50%, ${colors.darkBlue}80 0%, transparent 70%)`,
          }}
        >
          <div className="max-w-5xl w-full px-8">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <span className="bg-[#7091E6] text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider">Benefits</span>
              <h2 className="text-white text-4xl font-bold mt-4 mb-6">Why Choose Our Solution</h2>
              <p className="text-[#ADBBDA] text-lg max-w-2xl mx-auto">
                Vending Intelligence Suite provides substantial benefits for vending machine operators of all sizes.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              <motion.div className="flex items-start" variants={benefitItemVariants}>
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="text-[#7091E6] text-xl mr-4 mt-1 flex-shrink-0"
                >
                  <FaCheckCircle />
                </motion.div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-2">Increase Revenue</h3>
                  <p className="text-[#ADBBDA]">Optimize product selection and pricing based on actual sales data to maximize profit per machine.</p>
                </div>
              </motion.div>
              
              <motion.div className="flex items-start" variants={benefitItemVariants}>
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="text-[#7091E6] text-xl mr-4 mt-1 flex-shrink-0"
                >
                  <FaCheckCircle />
                </motion.div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-2">Reduce Costs</h3>
                  <p className="text-[#ADBBDA]">Plan efficient restocking routes and eliminate unnecessary service visits with real-time inventory tracking.</p>
                </div>
              </motion.div>
              
              <motion.div className="flex items-start" variants={benefitItemVariants}>
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="text-[#7091E6] text-xl mr-4 mt-1 flex-shrink-0"
                >
                  <FaCheckCircle />
                </motion.div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-2">Save Time</h3>
                  <p className="text-[#ADBBDA]">Automate data collection and report generation, freeing you to focus on growing your business.</p>
                </div>
              </motion.div>
              
              <motion.div className="flex items-start" variants={benefitItemVariants}>
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="text-[#7091E6] text-xl mr-4 mt-1 flex-shrink-0"
                >
                  <FaCheckCircle />
                </motion.div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-2">Prevent Losses</h3>
                  <p className="text-[#ADBBDA]">Identify discrepancies and potential issues before they impact your bottom line.</p>
                </div>
              </motion.div>
              
              <motion.div className="flex items-start" variants={benefitItemVariants}>
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="text-[#7091E6] text-xl mr-4 mt-1 flex-shrink-0"
                >
                  <FaCheckCircle />
                </motion.div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-2">Scale Efficiently</h3>
                  <p className="text-[#ADBBDA]">Easily manage growth from a few machines to hundreds with our scalable platform.</p>
                </div>
              </motion.div>
              
              <motion.div className="flex items-start" variants={benefitItemVariants}>
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="text-[#7091E6] text-xl mr-4 mt-1 flex-shrink-0"
                >
                  <FaCheckCircle />
                </motion.div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-2">Make Better Decisions</h3>
                  <p className="text-[#ADBBDA]">Use data-driven insights to optimize machine placement and product mix for maximum returns.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </ParallaxLayer>

        {/* Pricing section - exactly 1 page */}
        <ParallaxLayer
          offset={4.0}
          speed={0.6}
          factor={1}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="max-w-4xl w-full px-8">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <span className="bg-[#7091E6] text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider">Pricing</span>
              <h2 className="text-white text-4xl font-bold mt-4 mb-4">Simple, Affordable Pricing</h2>
              <p className="text-[#ADBBDA] text-lg max-w-2xl mx-auto">
                Start monitoring your vending machines with our cost-effective solution, designed to deliver value from day one.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-[#3D52A0] to-[#2A3973] rounded-xl overflow-hidden shadow-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#ADBBDA] text-sm uppercase tracking-wider font-medium">Standard Plan</p>
                    <h3 className="text-white text-3xl font-bold">Complete Solution</h3>
                  </div>
                  <motion.div 
                    className="bg-[#7091E6] h-16 w-16 rounded-full flex items-center justify-center"
                    variants={iconVariants}
                    whileHover={{ rotate: 360, transition: { duration: 1, ease: "easeInOut" } }}
                  >
                    <FaRegLightbulb className="text-3xl text-white" />
                  </motion.div>
                </div>

                <div className="flex items-end mb-8">
                  <div className="mr-6">
                    <p className="text-[#ADBBDA] text-sm mb-1">Initial Cost</p>
                    <div className="flex items-end">
                      <motion.span 
                        className="text-white text-4xl font-bold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        $10
                      </motion.span>
                      <span className="text-[#ADBBDA] ml-2 pb-1">for device + first month</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#ADBBDA] text-sm mb-1">Monthly Fee</p>
                    <div className="flex items-end">
                      <motion.span 
                        className="text-white text-4xl font-bold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        $8
                      </motion.span>
                      <span className="text-[#ADBBDA] ml-2 pb-1">/month thereafter</span>
                    </div>
                  </div>
                </div>

                <motion.div 
                  className="bg-[rgba(255,255,255,0.1)] p-4 rounded-lg mb-8"
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold">Optional Analytics Module</h4>
                      <p className="text-[#ADBBDA] text-sm">Enhanced analytics and reporting capabilities</p>
                    </div>
                    <div>
                      <span className="text-white font-bold">+$5</span>
                      <span className="text-[#ADBBDA] text-sm">/month</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="grid md:grid-cols-2 gap-6 mb-8"
                  variants={staggerContainer}
                >
                  <ul className="text-[#EDE8F5] space-y-3">
                    <motion.li className="flex items-center" variants={benefitItemVariants}>
                      <div className="h-5 w-5 mr-2 rounded-full bg-[#7091E6] flex items-center justify-center">
                        <motion.svg 
                          className="h-3 w-3 text-white" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      </div>
                      Real-time sales monitoring
                    </motion.li>
                    <motion.li className="flex items-center" variants={benefitItemVariants}>
                      <div className="h-5 w-5 mr-2 rounded-full bg-[#7091E6] flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Inventory tracking
                    </motion.li>
                    <motion.li className="flex items-center" variants={benefitItemVariants}>
                      <div className="h-5 w-5 mr-2 rounded-full bg-[#7091E6] flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Mobile dashboard access
                    </motion.li>
                  </ul>
                  <ul className="text-[#EDE8F5] space-y-3">
                    <motion.li className="flex items-center" variants={benefitItemVariants}>
                      <div className="h-5 w-5 mr-2 rounded-full bg-[#7091E6] flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Basic reporting
                    </motion.li>
                    <motion.li className="flex items-center" variants={benefitItemVariants}>
                      <div className="h-5 w-5 mr-2 rounded-full bg-[#7091E6] flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Email support
                    </motion.li>
                    <motion.li className="flex items-center" variants={benefitItemVariants}>
                      <div className="h-5 w-5 mr-2 rounded-full bg-[#7091E6] flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Cloud data storage
                    </motion.li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={staggerContainer}
                >
                  <motion.button 
                    className="py-3 px-6 bg-white text-[#3D52A0] rounded-lg font-medium hover:bg-[#EDE8F5] transition-colors duration-300 flex-1"
                    variants={fadeIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                  <motion.button 
                    className="py-3 px-6 bg-transparent text-white border border-white rounded-lg font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-300 flex-1"
                    variants={fadeIn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Sales
                  </motion.button>
                </motion.div>

                <p className="text-[#ADBBDA] text-sm text-center mt-6">
                  No contracts. Cancel anytime. All prices exclude applicable taxes.
                </p>
              </div>
            </motion.div>
          </div>
        </ParallaxLayer>

        {/* Decorative stars - spans all pages */}
        <ParallaxLayer
          offset={0}
          speed={0.1}
          factor={5}
        >
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
        
        {/* Floating geometric shapes - spans all pages */}
        <ParallaxLayer
          offset={0}
          speed={0.2}
          factor={5}
        >
          {shapes.map((shape, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: shape.opacity }}
              transition={{ duration: 2, delay: i * 0.2 }}
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
      </Parallax>
    </div>
  );
};

export default HomePage;