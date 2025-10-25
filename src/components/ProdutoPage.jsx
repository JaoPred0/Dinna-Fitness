import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProdutoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { cartItems, addToCart } = useCart();



  // busca produto
  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "produtos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduto(data);
          setSelectedImage(0);
          setError(null);
        } else {
          setError("Produto não encontrado.");
        }
      } catch (err) {
        setError("Erro ao carregar produto.");
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduto();
  }, [id]);

  // troca automática de imagens a cada 4s
  useEffect(() => {
    if (produto?.images?.length > 1) {
      const interval = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % produto.images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [produto]);

  const handleAddToCart = async () => {
    if (!selectedSize && produto.sizes?.length > 0) {
      alert("Selecione um tamanho antes de adicionar ao carrinho.");
      return;
    }

    const item = {
      id: produto.id ?? "",                  // string vazia se undefined
      title: produto.title ?? "",
      price: parseFloat(produto.price) || 0,
      quantity: 1,
      images: produto.images || [],
    };

    // Adiciona selectedSize só se não for undefined
    if (selectedSize) {
      item.selectedSize = selectedSize;
    }

    // Remove qualquer campo undefined do objeto (extra segurança)
    Object.keys(item).forEach(key => {
      if (item[key] === undefined) delete item[key];
    });



    // Adiciona ao contexto
    addToCart(item);

    // Salva no Firestore
    if (!auth.currentUser) {
      alert("Você precisa estar logado para salvar o carrinho.");
      return;
    }

    try {
      const userCartRef = doc(db, "carts", auth.currentUser.uid);
      const userCartSnap = await getDoc(userCartRef);

      if (userCartSnap.exists()) {
        await updateDoc(userCartRef, {
          items: arrayUnion(item),
        });
      } else {
        await setDoc(userCartRef, { items: [item] });
      }

      alert("Produto adicionado ao carrinho e salvo no Firebase!");
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
      alert("Erro ao salvar no carrinho.");
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          className="text-gray-600 text-xl animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Carregando detalhes...
        </motion.div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          className="text-center text-gray-600 p-8 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">{error || "Produto sumiu!"}</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-full font-semibold transition-colors"
          >
            Voltar à loja
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition-colors w-fit border border-gray-200 px-3 py-2 rounded-lg"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Imagens */}
        <div className="flex-1 flex flex-col items-center space-y-6">
          <motion.div
            className="relative w-full max-w-2xl h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-lg bg-gray-100 border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {produto.images && produto.images[selectedImage] ? (
              <img
                src={produto.images[selectedImage]}
                alt={produto.title}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sem imagem disponível
              </div>
            )}
          </motion.div>

          {/* Thumbnails */}
          {produto.images && produto.images.length > 1 && (
            <div className="flex gap-3 flex-wrap justify-center">
              {produto.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${selectedImage === idx
                    ? "border-black"
                    : "border-gray-300 hover:border-gray-500"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={img}
                    alt={`${produto.title} thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes */}
        <motion.div
          className="flex-1 space-y-6 max-w-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {produto.title}
          </h1>

          <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-4">
            R$ {parseFloat(produto.price).toFixed(2).replace(".", ",")}
          </div>

          {/* Tamanhos */}
          {produto.sizes && produto.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Tamanhos disponíveis:
              </h3>
              <div className="flex flex-wrap gap-2">
                {produto.sizes.map((size, idx) => (
                  <motion.button
                    key={idx}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors
            ${selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
                    onClick={() => setSelectedSize(size)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}


          {/* Políticas */}
          {produto.policies && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">
                Informações importantes:
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-black">
                    Trocas e devoluções:
                  </span>{" "}
                  {produto.policies.returns}
                </p>
                <p>
                  <span className="font-medium text-black">Rastreamento:</span>{" "}
                  {produto.policies.tracking}
                </p>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {/* Adicionar ao carrinho */}
            <motion.button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={24} />
              Adicionar ao carrinho
            </motion.button>

            {/* Comprar Agora */}
            <motion.button
              onClick={() => {
                handleAddToCart();
                navigate("/checkout");
              }}
              className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={24} />
              Comprar Agora
            </motion.button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ProdutoPage;
