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
    <nav className="bg-gradient-to-r from-gray-900/95 via-black/80 to-gray-900/90 backdrop-blur-2xl border-b border-gray-700/30 shadow-xl flex items-center justify-between px-6 py-4 sticky top-0 z-40">  
      <div className="flex items-center gap-4">  
        <button onClick={toggleSidebar} className="md:hidden p-3 rounded-xl hover:bg-gray-800/40 transition-all duration-200 backdrop-blur-sm text-gray-300 hover:text-white">  
          <motion.div whileTap={{ scale: 0.95 }}>  
            <Menu className="w-6 h-6" />  
          </motion.div>  
        </button>  
         
      </div>  
      <motion.button  
        onClick={handleLogout}  
        className="flex items-center gap-2 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/90 hover:to-red-800/90 text-white border border-red-600/50 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"  
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