import React from 'react';  
import { motion } from 'framer-motion';  
import { ShoppingCart, Package, DollarSign, Users, TrendingUp } from 'lucide-react';  

const DashboardCards = () => {  
  const stats = [  
    {  
      title: 'Vendas Hoje',  
      value: 'R$ 2.450',  
      change: '+12%',  
      icon: ShoppingCart,  
      color: 'from-blue-500 to-indigo-600'  
    },  
    {  
      title: 'Produtos Vendidos',  
      value: '156',  
      change: '+8%',  
      icon: Package,  
      color: 'from-green-500 to-emerald-600'  
    },  
    {  
      title: 'Receita Total',  
      value: 'R$ 45.200',  
      change: '+25%',  
      icon: DollarSign,  
      color: 'from-purple-500 to-pink-600'  
    },  
    {  
      title: 'Novos Clientes',  
      value: '23',  
      change: '+15%',  
      icon: Users,  
      color: 'from-orange-500 to-red-600'  
    }  
  ];  

  return (  
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">  
      {stats.map((stat, index) => {  
        const Icon = stat.icon;  
        return (  
          <motion.div  
            key={stat.title}  
            initial={{ opacity: 0, y: 20 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ delay: index * 0.1, duration: 0.5 }}  
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"  
          >  
            <div className="flex items-center justify-between">  
              <div>  
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>  
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>  
                <p className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>  
                  {stat.change} vs ontem  
                </p>  
              </div>  
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>  
                <Icon className="w-6 h-6 text-white" />  
              </div>  
            </div>  
          </motion.div>  
        );  
      })}  
    </div>  
  );  
};  

export default DashboardCards;