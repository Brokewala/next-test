import { motion } from 'framer-motion';
import React from 'react';

const LoadLogOut: React.FC = () => {

  return (
    <div className="fixed inset-0 w-screen flex items-center justify-center h-screen bg-white z-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Merci pour votre visite !
        </h1>
        <p className="text-gray-600 mb-6">
          Nous espérons vous revoir bientôt. Prenez soin de vous !
        </p>
        <motion.div
          className="w-12 h-12 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mx-auto"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default LoadLogOut;