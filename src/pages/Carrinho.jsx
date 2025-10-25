import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const Carrinho = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Carrega carrinho do Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUserId(user.uid);
        const userCartRef = doc(db, "carts", user.uid);
        const snap = await getDoc(userCartRef);

        if (snap.exists()) {
          setCartItems(snap.data().items || []);
        } else {
          // cria documento vazio se não existir
          await setDoc(userCartRef, { items: [] });
          setCartItems([]);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const updateQuantity = async (item, newQuantity) => {
    if (!userId) return;

    const userCartRef = doc(db, "carts", userId);

    // Remove item antigo
    await updateDoc(userCartRef, { items: arrayRemove(item) });

    // Atualiza quantidade
    const updatedItem = { ...item, quantity: newQuantity };

    // Adiciona item atualizado
    await updateDoc(userCartRef, { items: arrayUnion(updatedItem) });

    // Atualiza estado local
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === item.id && i.selectedSize === item.selectedSize ? updatedItem : i
      )
    );
  };

  const removeFromCart = async (item) => {
    if (!userId) return;
    const userCartRef = doc(db, "carts", userId);
    await updateDoc(userCartRef, { items: arrayRemove(item) });
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === item.id && i.selectedSize === item.selectedSize))
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  if (loading) return <p>Carregando...</p>;

  if (cartItems.length === 0)
    return (
      <div className="text-center py-16">
        <p>Seu carrinho está vazio.</p>
        <button onClick={() => navigate("/produtos")}>Ver Produtos</button>
      </div>
    );

  return (
    <div className="p-6 min-h-screen max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🛒 Meu Carrinho</h2>

      {cartItems.map((item, idx) => (
        <div
          key={`${item.id}-${item.selectedSize}-${idx}`}
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
              R$ {parseFloat(item.price).toFixed(2).replace(".", ",")}
            </p>
            {item.selectedSize && (
              <p className="text-gray-500 text-sm mt-1">
                Tamanho: <span className="font-medium">{item.selectedSize}</span>
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() =>
                  updateQuantity(item, Math.max(item.quantity - 1, 1))
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <Minus size={16} />
              </button>
              <span className="font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item, item.quantity + 1)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item)}
            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <div className="bg-white rounded-xl shadow-md p-6 h-fit flex flex-col gap-4 mt-6">
        <h3 className="font-bold text-xl mb-4">Resumo</h3>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete</span>
          <span className="text-green-600">Grátis</span>
        </div>
        <div className="border-t my-3"></div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default Carrinho;
