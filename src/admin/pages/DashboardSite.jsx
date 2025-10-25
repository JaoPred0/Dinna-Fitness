import React, { useEffect } from "react";  
import { motion } from "framer-motion";  
import { Image, Layout, ArrowRight } from "lucide-react";  
import { useNavigate } from "react-router-dom";  

const DashboardAdmin = () => {  
  const navigate = useNavigate();  

  useEffect(() => {  
    document.title = "Dashboard - Site";  
  }, []);  

  const cards = [  
    {  
      title: "Gerenciar Banners",  
      description: "Adicione, edite e remova banners exibidos no site de forma rápida.",  
      icon: Image,  
      link: "/admin/site/banner",  
      color: "from-indigo-500 to-blue-500",  
    },  
    {  
      title: "Gerenciar Navbar",  
      description: "Edite os links e menus de navegação do site com total controle.",  
      icon: Layout,  
      link: "/admin/site/navbar",  
      color: "from-green-500 to-emerald-500",  
    },  
  ];  

  const cardVariants = {  
    hover: {  
      y: -8,  
      scale: 1.02,  
      transition: { duration: 0.3, ease: "easeOut" }  
    }  
  };  

  return (  
    <div className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-white to-gray-50">  
      <div className="max-w-4xl mx-auto">  
        <motion.h2  
          className="text-4xl font-bold mb-10 text-gray-900 flex items-center justify-center gap-3"  
          initial={{ opacity: 0, y: -20 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.6 }}  
        >  
          Painel de Administração do Site  
        </motion.h2>  

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">  
          {cards.map((card, i) => (  
            <motion.div  
              key={i}  
              variants={cardVariants}  
              whileHover="hover"  
              onClick={() => navigate(card.link)}  
              className="cursor-pointer p-8 rounded-3xl shadow-lg bg-white border border-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:border-blue-200/50"  
              initial={{ opacity: 0, y: 20 }}  
              animate={{ opacity: 1, y: 0 }}  
              transition={{ duration: 0.5, delay: i * 0.1 }}  
            >  
              <div className="flex items-center justify-between mb-6">  
                <motion.div  
                  className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-lg`}  
                  whileHover={{ rotate: 5, scale: 1.1 }}  
                  transition={{ duration: 0.2 }}  
                >  
                  <card.icon className="w-7 h-7 text-white" />  
                </motion.div>  
                <motion.div  
                  whileHover={{ x: 4 }}  
                  className="p-2 bg-gray-100 rounded-xl"  
                >  
                  <ArrowRight className="w-5 h-5 text-gray-600" />  
                </motion.div>  
              </div>  
              <h3 className="text-2xl font-bold text-gray-900 mb-3">  
                {card.title}  
              </h3>  
              <p className="text-gray-600 font-medium leading-relaxed text-base">  
                {card.description}  
              </p>  
            </motion.div>  
          ))}  
        </div>  
      </div>  
    </div>  
  );  
};  

export default DashboardAdmin;