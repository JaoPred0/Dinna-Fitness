import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProdutoCard = ({ produto }) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);

  const handleComprar = (e) => {
    e.stopPropagation();
    if (produto.sizes?.length && !selectedSize) {
      // Se o produto tem tamanhos mas nenhum foi selecionado
      navigate(`/produtos/${produto.id}`);
    } else {
      // Redireciona para checkout com tamanho selecionado
      navigate(`/checkout/${produto.id}?size=${selectedSize || ""}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] group flex flex-col cursor-pointer">
      
      {/* Imagem */}
      <div
        onClick={() => navigate(`/produtos/${produto.id}`)}
        className="relative w-full h-64 md:h-72 lg:h-80 bg-gray-50 flex items-center justify-center overflow-hidden "
      >
        {produto.images?.[0] ? (
          <img
            src={produto.images[0]}
            alt={produto.title}
            className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
            Imagem indisponível
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          onClick={() => navigate(`/produtos/${produto.id}`)}
          className="font-semibold text-gray-900 text-base md:text-lg line-clamp-2 hover:text-green-700 transition-colors duration-200"
        >
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition cursor-pointer
                  ${
                    selectedSize === size
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-300"
                  }`}
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Botão Comprar */}
        <button
          onClick={handleComprar}
          className="mt-5 flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default ProdutoCard;
