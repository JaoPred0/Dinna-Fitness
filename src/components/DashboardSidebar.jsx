import React, { useState, useEffect } from "react";  
import { motion } from "framer-motion";  
import { Home, Package, ShoppingCart, Users, BarChart3, Settings } from "lucide-react";  
import { NavLink, useLocation } from "react-router-dom";  

const SidebarItem = ({ icon: Icon, label, to, isActive, onClick }) => (  
  <div  
    onClick={onClick}  
    className={`flex items-center gap-4 p-4 rounded-2xl mx-2 my-1 transition-all duration-300 ease-out backdrop-blur-sm font-semibold text-base leading-relaxed cursor-pointer ${  
      isActive  
        ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-l-4 border-blue-400 shadow-lg text-gray-900"  
        : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 hover:pl-3"  
    }`}  
  >  
    <motion.div  
      whileHover={{ scale: 1.1 }}  
      className="flex-shrink-0 w-8 h-8 p-1.5 rounded-lg bg-gradient-to-r from-blue-100/50 to-indigo-100/50 flex items-center justify-center"  
    >  
      <Icon className="w-5 h-5 text-blue-600" />  
    </motion.div>  
    <span className="tracking-wide">{label}</span>  
  </div>  
);  

const DashboardSidebar = ({ isOpen, onLinkClick }) => {  
  const location = useLocation();  
  const [activePath, setActivePath] = useState(location.pathname);  

  useEffect(() => {  
    setActivePath(location.pathname);  
  }, [location.pathname]);  

  const handleClick = (path) => {  
    setActivePath(path);  
    if (onLinkClick) onLinkClick();  
  };  

  const links = [  
    { label: "Visão Geral", icon: Home, to: "/admin" },  
    { label: "Site", icon: Package, to: "/admin/site" },  
    { label: "Produtos", icon: Package, to: "/admin/produtos" },  
    { label: "Vendas", icon: ShoppingCart, to: "/admin/orders" },  
  ];  

  return (  
    <motion.aside  
      className={`bg-white/95 backdrop-blur-2xl shadow-xl border-r border-gray-200/40 w-72 min-w-[280px] space-y-1 p-6 fixed md:static h-full z-50 overflow-y-auto ${  
        isOpen ? "translate-x-0" : "-translate-x-full"  
      } md:translate-x-0 transition-all duration-500 ease-out`}  
      initial={false}  
      animate={{ x: isOpen ? 0 : -288 }}  
    >  
      <div className="mb-10 pb-6 border-b border-gray-200/40 flex flex-col items-center text-center">  
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">  
          <Home className="w-7 h-7 text-white" />  
        </div>  
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Pro</h2>  
        <p className="text-sm text-gray-500 font-medium mt-1">Controle total da loja</p>  
      </div>  

      <nav className="space-y-2 flex-grow">  
        {links.map((link) => (  
          <NavLink key={link.to} to={link.to}>  
            <SidebarItem  
              icon={link.icon}  
              label={link.label}  
              isActive={activePath === link.to}  
              onClick={() => handleClick(link.to)}  
            />  
          </NavLink>  
        ))}  
      </nav>  

      <div className="absolute bottom-6 w-full text-center px-3">  
        <p className="text-xs text-gray-400 italic bg-gray-50/50 rounded-lg p-2">Versão 2.0</p>  
      </div>  
    </motion.aside>  
  );  
};  

export default DashboardSidebar;