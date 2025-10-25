import React from "react";    
import { LogOut, Menu, ShoppingBag } from "lucide-react";    
import { useNavigate } from "react-router-dom";    
import { motion } from 'framer-motion';    

const DashboardNavbar = ({ toggleSidebar }) => {    
  const navigate = useNavigate();    

  const handleLogout = async () => {    
    // Simula logout, redireciona pra home    
    navigate("/");    
  };    

  return (    
    <nav className="bg-white/95 backdrop-blur-2xl border-b border-gray-200/30 shadow-lg flex items-center justify-between px-6 py-4 sticky top-0 z-40">    
      <div className="flex items-center gap-4">    
        <button onClick={toggleSidebar} className="md:hidden p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 backdrop-blur-sm text-gray-600 hover:text-gray-900">    
          <motion.div whileTap={{ scale: 0.95 }}>    
            <Menu className="w-6 h-6" />    
          </motion.div>    
        </button>       
      </div>    
      <motion.button    
        onClick={handleLogout}    
        className="flex items-center gap-2 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/90 hover:to-red-700/90 text-white border border-red-500/50 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"    
        whileHover={{ scale: 1.05, y: -1 }}    
        whileTap={{ scale: 0.98 }}    
      >    
        <LogOut className="w-4 h-4" />    
        Sair do Painel     
      </motion.button>    
    </nav>    
  );    
};    

export default DashboardNavbar;