
import React from 'react';
import { motion } from 'framer-motion';
import ChartWidget from '@/components/ChartWidget';
import SignalPanel from '@/components/SignalPanel';
import WatchlistWidget from '@/components/WatchlistWidget';
import RiskMeter from '@/components/RiskMeter';
import MarketOverview from '@/components/MarketOverview';
import PerformanceStats from '@/components/PerformanceStats';

const Dashboard = ({ isBeginnerMode }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.main
      aria-labelledby="dashboard-heading"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full p-2 sm:p-4 space-y-4 sm:space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 id="dashboard-heading" className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 gradient-text">
          {isBeginnerMode ? "Trading Dashboard - Beginner" : "Professional Trading Dashboard"}
        </h1>
      </motion.div>
      
      {isBeginnerMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-[calc(100%-60px)] sm:h-[calc(100%-80px)]">
          <motion.div variants={itemVariants} className="space-y-4 flex flex-col">
            <div className="flex-1 min-h-[250px] sm:min-h-[300px]">
              <ChartWidget />
            </div>
            <div className="h-1/3 min-h-[200px] sm:min-h-auto">
              <RiskMeter />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-4 flex flex-col">
             <div className="flex-1 min-h-[250px] sm:min-h-[300px]">
              <SignalPanel simplified={true} />
            </div>
            <div className="h-1/3 min-h-[200px] sm:min-h-auto">
              <WatchlistWidget />
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-2 sm:gap-4 h-[calc(100%-60px)] sm:h-[calc(100%-80px)] overflow-y-auto scrollbar-hide">
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 row-span-1 lg:row-span-2 min-h-[300px] sm:min-h-[400px]">
            <ChartWidget />
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[200px]">
            <MarketOverview />
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[200px]">
            <RiskMeter />
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-6 min-h-[250px]">
            <SignalPanel />
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 lg:col-span-3 min-h-[200px]">
            <WatchlistWidget />
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 lg:col-span-3 min-h-[200px]">
            <PerformanceStats />
          </motion.div>
        </div>
      )}
    </motion.main>
  );
};

export default Dashboard;
