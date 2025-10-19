import React, { useState, useEffect } from "react";
import { PlusCircle, X, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const NovoProduto = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [price, setPrice] = useState("");
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

  // Buscar produtos existentes
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    const allProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(allProducts);
  };

  // Buscar categorias
  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    const cats = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCategories(cats);
  };

  // Gerar link do produto
  const generateProductLink = (title) => {
    return `/produtos/${title.replace(/\s+/g, "-").toLowerCase()}`;
  };

  // Adicionar tamanho
  const handleAddSize = () => {
    if (newSize.trim() !== "" && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  // Adicionar imagem
  const handleAddImage = () => {
    if (newImage.trim() !== "") {
      setImages([...images, newImage.trim()]);
      setNewImage("");
    }
  };

  const handleRemoveImage = (imgToRemove) => {
    setImages(images.filter((img) => img !== imgToRemove));
  };

  // Criar nova categoria
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "categorias"), {
        name: newCategory.trim(),
        iconName: "Sparkles", // ícone padrão
      });

      const newCatObj = { id: docRef.id, name: newCategory.trim(), iconName: "Sparkles" };
      setCategories([...categories, newCatObj]);
      setSelectedCategories([...selectedCategories, newCategory.trim()]);
      setNewCategory("");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  // Alternar seleção de categoria
  const handleToggleCategory = (catName) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  // Salvar produto
  const handleSubmit = async () => {
    if (!productTitle || !price || selectedCategories.length === 0) {
      alert("Preencha título, preço e pelo menos uma categoria!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "produtos"), {
        title: productTitle,
        price,
        sizes,
        images,
        categories: selectedCategories,
        policies: {
          returns: "Você tem até 7 dias para a solicitação (exceto peças promocionais)",
          tracking: "Você receberá o seu rastreamento no seu email ainda esta semana",
        },
      });

      // Atualiza link do produto
      const productLink = `/produtos/${docRef.id}`;
      await setDoc(doc(db, "produtos", docRef.id), { productLink }, { merge: true });

      // Limpar formulário
      setModalOpen(false);
      setProductTitle("");
      setPrice("");
      setSizes([]);
      setImages([]);
      setSelectedCategories([]);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Card Novo Produto */}
      <div className="bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col items-center text-center relative mb-8">
        <button
          onClick={() => setModalOpen(true)}
          className="absolute top-2 right-2 bg-black text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        <PlusCircle className="w-10 h-10 text-white mb-2" />
        <h3 className="text-lg font-bold text-white mb-1">Novo Produto</h3>
        <p className="text-gray-300 text-sm">Adicione um novo produto</p>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-3">Adicionar Produto</h2>

            {/* Título */}
            <label className="block text-gray-300 mb-1">Título</label>
            <input
              type="text"
              className="w-full p-2 rounded-md mb-2 bg-gray-800 text-white border border-gray-700"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
            />

            {/* Preço */}
            <label className="block text-gray-300 mb-1">Preço</label>
            <input
              type="text"
              className="w-full p-2 rounded-md mb-2 bg-gray-800 text-white border border-gray-700"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {/* Categorias */}
            <label className="block text-gray-300 mb-1">Categorias</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-md">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleToggleCategory(cat.name)}
                    className="accent-primary"
                  />
                  <span className="text-white text-sm">{cat.name}</span>
                  <button
                    onClick={async () => {
                      try {
                        // Remove do Firestore
                        await deleteDoc(doc(db, "categorias", cat.id));
                        // Remove do estado
                        setCategories(categories.filter(c => c.id !== cat.id));
                        setSelectedCategories(selectedCategories.filter(c => c !== cat.name));
                      } catch (error) {
                        console.error("Erro ao apagar categoria:", error);
                      }
                    }}
                    className="ml-1 text-red-500 hover:text-red-400"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* Nova categoria */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nova categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 p-2 rounded-md bg-gray-800 text-white border border-gray-700"
              />
              <button
                onClick={handleAddCategory}
                className="bg-black px-3 rounded-md text-white"
              >
                +
              </button>
            </div>

            {/* Tamanhos */}
            <label className="block text-gray-300 mb-1">Tamanhos</label>
            <div className="flex gap-1 mb-2">
              <input
                type="text"
                className="flex-1 p-1 rounded-md bg-gray-800 text-white border border-gray-700 text-sm"
                placeholder="Adicionar tamanho"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSize()}
              />
              <button
                onClick={handleAddSize}
                className="bg-black text-white px-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
              >
                +
              </button>
            </div>

            <ul className="mb-2">
              {sizes.map((size, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-700 text-white px-2 py-1 rounded-md mb-1"
                >
                  <span>{size}</span>
                  <button onClick={() => handleRemoveSize(size)}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Imagens */}
            <label className="block text-gray-300 mb-1">Fotos (links)</label>
            <div className="flex gap-1 mb-2">
              <input
                type="text"
                className="flex-1 p-1 rounded-md bg-gray-800 text-white border border-gray-700 text-sm"
                placeholder="Adicionar link da imagem"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddImage()}
              />
              <button
                onClick={handleAddImage}
                className="bg-black text-white px-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
              >
                +
              </button>
            </div>

            <ul className="mb-2">
              {images.map((img, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-700 text-white px-2 py-1 rounded-md mb-1"
                >
                  <span className="truncate max-w-xs">{img}</span>
                  <button onClick={() => handleRemoveImage(img)}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Link do produto */}
            <label className="block text-gray-300 mb-1">Link do produto</label>
            <input
              type="text"
              className="w-full p-2 rounded-md mb-2 bg-gray-800 text-white border border-gray-700 text-sm"
              value={generateProductLink(productTitle)}
              readOnly
            />

            {/* Botão salvar */}
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Salvar Produto
            </button>
          </motion.div>
        </div>
      )}

      {/* Produtos cadastrados */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((prod) => (
          <div key={prod.id} className="bg-gray-800 p-4 rounded-xl shadow-md text-white">
            <h3 className="font-bold text-lg">{prod.title}</h3>
            <p className="text-gray-300">Preço: {prod.price}</p>
            <p className="text-gray-300 text-sm">
              Categorias: {prod.categories?.join(", ")}
            </p>
            <p className="text-gray-300 text-sm">Link: {prod.productLink}</p>

            <ul className="mt-1 mb-1">
              {prod.sizes?.map((s, idx) => (
                <li
                  key={idx}
                  className="bg-gray-700 px-2 py-1 rounded-md text-xs mb-1"
                >
                  {s}
                </li>
              ))}
            </ul>

            <ul className="mt-2 flex gap-2 flex-wrap">
              {prod.images?.map((img, idx) => (
                <li key={idx}>
                  <img
                    src={img}
                    alt={`Img ${idx}`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NovoProduto;
