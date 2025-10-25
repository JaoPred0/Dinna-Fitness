import React, { useEffect } from "react";  
import { Link } from "react-router-dom";  
import { motion } from "framer-motion";  
import { PlusCircle, Edit3 } from "lucide-react";  

const DashboardProdutos = () => {  
  useEffect(() => {  
    document.title = "Dashboard - Produtos"; // muda o título da aba do navegador  
  }, []);  

  const cardVariants = {  
    hover: {  
      scale: 1.05,  
      y: -10,  
      transition: { duration: 0.3, ease: "easeOut" }  
    }  
  };  

  return (  
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-white to-gray-50">  
      <div className="max-w-4xl mx-auto">  
        <motion.h1  
          className="text-3xl font-bold text-gray-900 mb-8 text-center"  
          initial={{ opacity: 0, y: -20 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.6 }}  
        >  
          Gerencie Seus Produtos  
        </motion.h1>  

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">  
          {/* Card Gerenciar Produtos */}  
          <motion.div  
            variants={cardVariants}  
            whileHover="hover"  
          >  
            <Link  
              to="/admin/produtos/gerenciar"  
              className="block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center justify-center text-center cursor-pointer border border-gray-200/50 hover:border-blue-200/50"  
            >  
              <motion.div  
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"  
                whileHover={{ rotate: 5, scale: 1.1 }}  
                transition={{ duration: 0.2 }}  
              >  
                <Edit3 className="w-8 h-8 text-white" />  
              </motion.div>  
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Gerenciar Produtos</h3>  
              <p className="text-gray-600 font-medium leading-relaxed">Edite, exclua ou visualize produtos existentes no seu catálogo.</p>  
            </Link>  
          </motion.div>  

          {/* Card Novo Produto */}  
          <motion.div  
            variants={cardVariants}  
            whileHover="hover"  
          >  
            <Link  
              to="/admin/produtos/novo"  
              className="block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center justify-center text-center cursor-pointer border border-gray-200/50 hover:border-green-200/50"  
            >  
              <motion.div  
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"  
                whileHover={{ rotate: -5, scale: 1.1 }}  
                transition={{ duration: 0.2 }}  
              >  
                <PlusCircle className="w-8 h-8 text-white" />  
              </motion.div>  
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Novo Produto</h3>  
              <p className="text-gray-600 font-medium leading-relaxed">Adicione um novo produto ao catálogo com facilidade total.</p>  
            </Link>  
          </motion.div>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default DashboardProdutos;