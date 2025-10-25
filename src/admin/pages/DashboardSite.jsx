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
      description: "Adicione, edite e remova banners exibidos no site.",
      icon: <Image className="w-10 h-10 text-indigo-500" />,
      link: "/admin/site/banner",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Gerenciar Navbar",
      description: "Edite os links e menus de navegação do site.",
      icon: <Layout className="w-10 h-10 text-green-500" />,
      link: "/admin/site/navbar",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.h2
        className="text-3xl font-bold mb-8 text-indigo-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Painel de Administração
      </motion.h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            onClick={() => navigate(card.link)}
            className={`cursor-pointer p-6 rounded-2xl shadow-lg bg-gradient-to-br ${card.color} text-white transition-transform hover:scale-[1.03] hover:shadow-2xl`}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-3">
              {card.icon}
              <ArrowRight className="w-6 h-6 opacity-70" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-sm opacity-90">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
