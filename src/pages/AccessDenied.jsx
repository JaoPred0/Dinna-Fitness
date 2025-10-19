import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Acesso Negado
      </motion.h1>
      <motion.p
        className="text-lg mb-6 text-gray-300 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Esta página só pode ser acessada por administradores.
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

export default AccessDenied;
