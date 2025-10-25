import React, { useState } from "react";  
import { motion, AnimatePresence } from "framer-motion";  
import DashboardNavbar from "./DashboardNavbar";  
import DashboardSidebar from "./DashboardSidebar";  

const DashboardLayout = ({ children }) => {  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // controla sidebar  

  const toggleSidebar = () => {  
    setIsSidebarOpen(!isSidebarOpen);  
  };  

  return (  
    <div className="flex h-screen bg-white/95 overflow-hidden">  
      {/* Sidebar */}  
      <AnimatePresence>  
        {isSidebarOpen && (  
          <motion.div  
            className="md:w-72 flex-shrink-0"  
            initial={{ width: 0 }}  
            animate={{ width: 280 }}  
            exit={{ width: 0 }}  
            transition={{ duration: 0.3, ease: "easeOut" }}  
          >  
            <DashboardSidebar isOpen={isSidebarOpen} />  
          </motion.div>  
        )}  
      </AnimatePresence>  

      {/* Conteúdo principal */}  
      <div className="flex-1 flex flex-col overflow-hidden relative">  
        <DashboardNavbar toggleSidebar={toggleSidebar} />  
        <main className="flex-1 overflow-y-auto p-8 bg-white/95 backdrop-blur-xl relative z-10">  
          <motion.div  
            initial={{ opacity: 0, y: 20 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.6, ease: "easeOut" }}  
            className="max-w-7xl mx-auto space-y-8 w-full"  
          >  
            {children}  
          </motion.div>  
        </main>  
      </div>  

      {/* Overlay para dispositivos móveis */}  
      <AnimatePresence>  
        {isSidebarOpen && (  
          <motion.div  
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"  
            initial={{ opacity: 0 }}  
            animate={{ opacity: 1 }}  
            exit={{ opacity: 0 }}  
            onClick={() => setIsSidebarOpen(false)}  
          />  
        )}  
      </AnimatePresence>  
    </div>  
  );  
};  

export default DashboardLayout;