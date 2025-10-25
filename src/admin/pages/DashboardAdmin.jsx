import React from "react";
import DashboardCards from "../../components/DashboardCards";
import { motion } from 'framer-motion';  
import { useEffect } from "react";

const DashboardAdmin = () => {  
  useEffect(() => {
    document.title = "Dashboard - Visão Geral"; // muda o título da aba do navegador
  }, []);
  return (  
    <>  
      <motion.h1 className="text-3xl font-bold text-gray-900 mb-6">Bem-vindo ao Dashboard da Loja</motion.h1>  
      <motion.p className="text-gray-600 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>  
        Gerencie seus produtos, pedidos e clientes com facilidade. Veja o resumo das vendas e mantenha tudo em dia.  
      </motion.p>  
      <DashboardCards />  
      {/* Adicione mais seções como tabela de produtos ou gráficos aqui */}  
    </>  
  );  
};  

export default DashboardAdmin;
