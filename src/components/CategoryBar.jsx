import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react"; // importa todos os ícones
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom"; // <-- React Router

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
    <section className="w-full py-10 px-4 sm:px-16 bg-muted/30 relative">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore por Categoria
      </motion.h2>

      <div className="overflow-x-auto no-scrollbar relative">
        <motion.div className="flex gap-4 sm:gap-6 px-4 sm:px-8 py-2">
          {categories.map((cat, idx) => {
            const Icon = Icons[cat.iconName] || Icons.Laptop;
            return (
              <motion.button
                key={idx}
                className="flex-shrink-0 px-6 sm:px-8 py-3 rounded-2xl
                   bg-gradient-to-br from-primary/20 to-primary/10
                   border border-primary/30 shadow-md
                   font-semibold whitespace-nowrap flex items-center gap-3
                   text-foreground transition-all duration-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/categoria/${encodeURIComponent(cat.name)}`)} // navega para a página de categoria
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span className="text-sm sm:text-base">{cat.name}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryBar;
