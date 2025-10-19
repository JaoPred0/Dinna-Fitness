import React, { useState, useEffect } from "react";
import { X, Trash2, Edit, Star } from "lucide-react";
import { motion } from "framer-motion";
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const GerenciarProdutos = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null); // produto sendo editado
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    const allProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(allProducts);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este produto?")) {
      await deleteDoc(doc(db, "produtos", id));
      fetchProducts();
    }
  };

  const handleToggleDestaque = async (prod) => {
    await setDoc(
      doc(db, "produtos", prod.id),
      { destaque: !prod.destaque },
      { merge: true }
    );
    fetchProducts();
  };

  const handleEdit = (prod) => {
    setEditProduct({ ...prod, destaque: prod.destaque ?? false, categories: prod.categories || [] });
    setModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editProduct) return;
    const { id, title, price, sizes, images, destaque } = editProduct;

    await setDoc(
      doc(db, "produtos", id),
      {
        title,
        price,
        sizes,
        images,
        destaque: destaque ?? false, // valor padrão false se undefined
        categories: editProduct.categories || [], // adiciona categories se tiver
      },
      { merge: true }
    );

    setModalOpen(false);
    setEditProduct(null);
    fetchProducts();
  };
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCategories(cats);
  };
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Produtos</h1>

      {/* Lista de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((prod) => (
          <div key={prod.id} className="bg-gray-800 p-4 rounded-xl shadow-md relative">
            <h3 className="font-bold text-lg">{prod.title}</h3>
            <p className="text-gray-300">Preço: {prod.price}</p>
            <p className="text-gray-300 text-sm">Link: {prod.productLink}</p>

            <ul className="mt-2">
              {prod.sizes?.map((s, idx) => (
                <li key={idx} className="bg-gray-700 px-2 py-1 rounded-md text-xs mb-1">{s}</li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1 mt-2">
              {prod.images?.map((img, idx) => (
                <img key={idx} src={img} alt={`Img ${idx}`} className="w-16 h-16 object-cover rounded-md" />
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button
                className={`px-2 py-1 rounded-md text-sm ${prod.destaque ? "bg-yellow-500 text-black" : "bg-gray-700"}`}
                onClick={() => handleToggleDestaque(prod)}
                title="Destacar produto"
              >
                <Star size={16} />
              </button>
              <button
                className="px-2 py-1 rounded-md text-sm bg-blue-600 hover:bg-blue-500"
                onClick={() => handleEdit(prod)}
                title="Editar produto"
              >
                <Edit size={16} />
              </button>
              <button
                className="px-2 py-1 rounded-md text-sm bg-red-600 hover:bg-red-500"
                onClick={() => handleDelete(prod.id)}
                title="Apagar produto"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edição */}
      {modalOpen && editProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md relative"
          >
            <button onClick={() => setModalOpen(false)} className="absolute top-2 right-2 text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-3">Editar Produto</h2>

            <label className="block text-gray-300 mb-1">Título</label>
            <input
              type="text"
              className="w-full p-2 rounded-md mb-2 bg-gray-800 text-white border border-gray-700"
              value={editProduct.title}
              onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
            />

            <label className="block text-gray-300 mb-1">Preço</label>
            <input
              type="text"
              className="w-full p-2 rounded-md mb-2 bg-gray-800 text-white border border-gray-700"
              value={editProduct.price}
              onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
            />

            <label className="block text-gray-300 mb-1">Categorias</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-md text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editProduct.categories?.includes(cat.name)}
                    onChange={(e) => {
                      const updatedCategories = e.target.checked
                        ? [...(editProduct.categories || []), cat.name]
                        : editProduct.categories.filter(c => c !== cat.name);
                      setEditProduct({ ...editProduct, categories: updatedCategories });
                    }}
                  />
                  {cat.name}
                </label>
              ))}
            </div>

            {/* Botão salvar */}
            <button
              onClick={handleSaveEdit}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              Salvar Alterações
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GerenciarProdutos;
