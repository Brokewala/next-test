"use client"
import { motion } from 'framer-motion';

const ErrorBoundary = ({error}: {error: Error}) => {
  return (
    <motion.div
      className="h-screen w-screen flex justify-center items-center bg-gray-900 text-white"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <motion.div
        className="text-center space-y-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.h1
          className="text-9xl font-bold tracking-widest"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-2xl font-semibold"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {error.message}
        </motion.p>
        <motion.a
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Retourner à l&apos;accueil
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default ErrorBoundary;