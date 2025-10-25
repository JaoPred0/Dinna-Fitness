import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { ShoppingCart, ArrowRight } from "lucide-react";
import ProdutoCard from "./ProdutoCard";
const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "produtos"), where("destaque", "==", true));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeaturedProducts(products);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar destaques. Tente atualizar a página.");
      console.error("Erro ao buscar produtos em destaque:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e?.preventDefault();
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-4 bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-gray-600 text-xl animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Carregando os destaques...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 px-4 bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center text-gray-600 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={fetchFeaturedProducts}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Tentar novamente
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-50 to-white">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Produtos em Destaque
      </motion.h2>

      {featuredProducts.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          scrollbar={{ draggable: true }}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 28 },
          }}
          className="max-w-7xl mx-auto"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProdutoCard produto={product} />
            </SwiperSlide>
          ))}

          <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/80 hover:bg-black text-white rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300"></div>
          <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-black/80 hover:bg-black text-white rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300"></div>
          <div className="swiper-pagination-custom mt-8 flex justify-center space-x-2"></div>
        </Swiper>
      ) : (
        <motion.div
          className="text-center py-12 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Nenhum produto em destaque no momento.
        </motion.div>
      )}

      <motion.div
        className="flex justify-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link
          to="/produtos"
          className="flex items-center gap-2 px-8 py-4 rounded-full font-bold bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Ver todos os produtos
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
};

export default FeaturedProducts;
