import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

const Carrinho = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login"); // redireciona se não estiver logado
      } else {
        setLoading(false); // usuário logado, libera a página
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  const total = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0
  );

  return (
    <div className="p-6 min-h-screen max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🛒 Meu Carrinho</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Seu carrinho está vazio.</p>
          <button
            onClick={() => navigate("/produtos")}
            className="mt-6 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Ver Produtos
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de produtos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white rounded-xl shadow-md p-4"
              >
                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600">
                    R$ {Number(item.price || 0).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                      }
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h3 className="font-bold text-xl mb-4">Resumo</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Frete</span>
              <span className="text-green-600">Grátis</span>
            </div>
            <div className="border-t my-3"></div>
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => alert("Finalizar compra (checkout futuramente)")}
              className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
            >
              Finalizar Compra
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-3 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Limpar Carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;
