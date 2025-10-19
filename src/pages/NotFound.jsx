import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.h1
        className="text-6xl font-bold mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-xl mb-6  text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Ops! Página não encontrada.
      </motion.p>
      <Link
        to="/"
        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
      >
        Voltar para Home
      </Link>
    </div>
  );
};

export default NotFound;
