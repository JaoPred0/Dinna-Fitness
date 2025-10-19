import React from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProdutoCard = ({ produto }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div
      onClick={() => navigate(`/produtos/${produto.id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02] group flex flex-col"
    >
      {/* Imagem */}
      {produto.images?.[0] && (
        <div className="relative w-full h-64 md:h-72 lg:h-80 bg-gray-100 overflow-hidden">
          <img
            src={produto.images[0]}
            alt={produto.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-base md:text-lg line-clamp-2">
          {produto.title}
        </h3>
        <p className="font-bold text-lg md:text-xl text-black mt-2">
          R$ {parseFloat(produto.price).toFixed(2).replace(".", ",")}
        </p>

        {/* Tamanhos */}
        {produto.sizes && produto.sizes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {produto.sizes.map((size, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-300 transition"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Botão Carrinho */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(produto);
          }}
          className="mt-5 flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
        >
          <ShoppingCart size={18} />
          <span>Adicionar</span>
        </button>
      </div>
    </div>
  );
};

export default ProdutoCard;
