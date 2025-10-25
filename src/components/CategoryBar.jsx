import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categorias"));
      const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  return (
    <section className="w-full py-8 px-4 sm:px-16 bg-white relative">
      {/* Título */}
      <motion.h2
        className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore por Categoria
      </motion.h2>

      {/* Barra de categorias */}
      <div className="overflow-x-auto no-scrollbar relative">
        <motion.div
          className="flex gap-4 sm:gap-6 px-2 sm:px-4 py-2"
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }} // Ajuste conforme número de categorias
          dragElastic={0.2}
        >
          {categories.map((cat, idx) => {
            const Icon = Icons[cat.iconName] || Icons.Laptop;
            return (
              <motion.button
                key={idx}
                className="
    flex-shrink-0 px-6 sm:px-8 py-4 rounded-2xl
    bg-white shadow-md
    flex items-center gap-3 text-gray-800 font-semibold whitespace-nowrap
    min-w-[140px]
    transition-all duration-300
  "
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 120 }}
                whileHover={{
                  scale: 1.05,               // aumenta um pouco
                  y: -2,                      // leve elevação
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", // sombra maior e mais suave
                }}
                whileTap={{ scale: 0.95 }}    // efeito ao clicar
                onClick={() => navigate(`/categoria/${encodeURIComponent(cat.name)}`)}
              >
                {/* Ícone com animação de leve movimento */}
                <motion.div
                  className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600"
                  whileHover={{ rotate: 10 }} // ícone gira levemente
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Icon className="w-full h-full" />
                </motion.div>

                {/* Texto com efeito de destaque ao hover */}
                <motion.span
                  whileHover={{ scale: 1.05, color: "#4F46E5" }} // muda cor do texto no hover
                  transition={{ duration: 0.2 }}
                  className="text-base sm:text-lg font-medium"
                >
                  {cat.name}
                </motion.span>
              </motion.button>
                
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryBar;
