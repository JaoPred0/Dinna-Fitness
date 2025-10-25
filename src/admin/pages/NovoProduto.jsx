import React, { useState, useEffect } from "react";
import { PlusCircle, X, Trash2, Upload, Tag, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const NovoProduto = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState("");
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    const allProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(allProducts);
  };

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    const cats = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCategories(cats);
  };

  const generateProductLink = (title) => {
    return `/produtos/${title.replace(/\s+/g, "-").toLowerCase()}`;
  };

  const handleAddSize = () => {
    if (newSize.trim() !== "" && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleAddImage = () => {
    if (newImage.trim() !== "") {
      setImages([...images, newImage.trim()]);
      setNewImage("");
    }
  };

  const handleRemoveImage = (imgToRemove) => {
    setImages(images.filter((img) => img !== imgToRemove));
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "categorias"), {
        name: newCategory.trim(),
        iconName: "Sparkles",
      });

      const newCatObj = { id: docRef.id, name: newCategory.trim(), iconName: "Sparkles" };
      setCategories([...categories, newCatObj]);
      setSelectedCategories([...selectedCategories, newCategory.trim()]);
      setNewCategory("");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  const handleToggleCategory = (catName) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const handleSubmit = async () => {
    if (!productTitle || !price || selectedCategories.length === 0) {
      alert("Preencha título, preço e pelo menos uma categoria!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "produtos"), {
        title: productTitle,
        price,
        description,
        stock: stock || "0",
        sku: sku || "",
        brand: brand || "",
        weight: weight || "",
        sizes,
        images,
        categories: selectedCategories,
        policies: {
          returns: "Você tem até 7 dias para a solicitação (exceto peças promocionais)",
          tracking: "Você receberá o seu rastreamento no seu email ainda esta semana",
        },
      });

      const productLink = `/produtos/${docRef.id}`;
      await setDoc(doc(db, "produtos", docRef.id), { productLink }, { merge: true });

      setModalOpen(false);
      setProductTitle("");
      setPrice("");
      setDescription("");
      setStock("");
      setSku("");
      setBrand("");
      setWeight("");
      setSizes([]);
      setImages([]);
      setSelectedCategories([]);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center relative mb-8 border border-gray-200 hover:shadow-xl transition-shadow">
        <button
          onClick={() => setModalOpen(true)}
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-full mb-4">
          <Package className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Novo Produto</h3>
        <p className="text-gray-500">Adicione um novo produto ao catálogo</p>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-3xl relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-2 hover:bg-gray-200"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Adicionar Produto</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Título do Produto *</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Ex: Tênis Nike Air Max"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Preço *</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="R$ 299,90"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Estoque</label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="100"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">SKU</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="PROD-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Marca</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Nike"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
                  <textarea
                    className="w-full p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    rows="3"
                    placeholder="Descrição detalhada do produto..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-600" />
                    Categorias *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                    {categories.map(cat => (
                      <div key={cat.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.name)}
                          onChange={() => handleToggleCategory(cat.name)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-gray-700 font-medium">{cat.name}</span>
                        <button
                          onClick={async () => {
                            try {
                              await deleteDoc(doc(db, "categorias", cat.id));
                              setCategories(categories.filter(c => c.id !== cat.id));
                              setSelectedCategories(selectedCategories.filter(c => c !== cat.name));
                            } catch (error) {
                              console.error("Erro ao apagar categoria:", error);
                            }
                          }}
                          className="ml-1 text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nova categoria"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                      className="flex-1 p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Tamanhos</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="flex-1 p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Ex: P, M, G, 38, 40..."
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSize()}
                    />
                    <button
                      onClick={handleAddSize}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 px-4 py-2 rounded-lg border border-blue-200 shadow-sm"
                      >
                        <span className="font-medium">{size}</span>
                        <button onClick={() => handleRemoveSize(size)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-600" />
                    Fotos (URLs)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="flex-1 p-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Cole o link da imagem aqui"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddImage()}
                    />
                    <button
                      onClick={handleAddImage}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative group rounded-xl overflow-hidden shadow-md border-2 border-gray-200"
                      >
                        <img src={img} alt={`Img ${idx}`} className="w-full h-24 object-cover" />
                        <button
                          onClick={() => handleRemoveImage(img)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  Salvar Produto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-200"
          >
            {prod.images && prod.images[0] && (
              <img src={prod.images[0]} alt={prod.title} className="w-full h-48 object-cover rounded-xl mb-4" />
            )}
            <h3 className="font-bold text-xl text-gray-800 mb-2">{prod.title}</h3>
            <p className="text-blue-600 font-bold text-lg mb-2">{prod.price}</p>
            {prod.brand && <p className="text-gray-500 text-sm mb-1">Marca: {prod.brand}</p>}
            {prod.stock && <p className="text-gray-500 text-sm mb-1">Estoque: {prod.stock}</p>}
            {prod.sku && <p className="text-gray-500 text-sm mb-2">SKU: {prod.sku}</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              {prod.categories?.map((cat, idx) => (
                <span key={idx} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {cat}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NovoProduto;
