"use client";

import { Loader } from "lucide-react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <motion.div 
      className="fixed top-0 left-0 w-screen flex flex-col items-center justify-center h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="mt-4 text-lg font-semibold text-gray-700">Chargement...</p>
    </motion.div>
  );
};

export default Loading;