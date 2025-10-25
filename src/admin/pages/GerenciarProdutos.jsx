import React, { useState, useEffect } from "react";  
import { X, Trash2, Edit, Star, Search, Filter } from "lucide-react";  
import { motion, AnimatePresence } from "framer-motion";  
import { collection, getDocs, doc, deleteDoc, setDoc, query, where } from "firebase/firestore";  
import { db } from "../../config/firebase";  

const GerenciarProdutos = () => {  
  const [products, setProducts] = useState([]);  
  const [filteredProducts, setFilteredProducts] = useState([]);  
  const [editProduct, setEditProduct] = useState(null);  
  const [modalOpen, setModalOpen] = useState(false);  
  const [searchTerm, setSearchTerm] = useState("");  
  const [selectedCategory, setSelectedCategory] = useState("all"); // "all" ou id da categoria  
  const [categories, setCategories] = useState([]);  

  useEffect(() => {  
    fetchProducts();  
    fetchCategories();  
  }, []);  

  useEffect(() => {  
    let filtered = [...products];  

    // Filtro de busca  
    if (searchTerm) {  
      filtered = filtered.filter(prod =>  
        prod.title?.toLowerCase().includes(searchTerm.toLowerCase())  
      );  
    }  

    // Filtro por categoria  
    if (selectedCategory !== "all") {  
      filtered = filtered.filter(prod =>  
        prod.categories?.some(cat => cat === categories.find(c => c.id === selectedCategory)?.name)  
      );  
    }  

    // Ordenar: destacados primeiro  
    filtered.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));  

    setFilteredProducts(filtered);  
  }, [products, searchTerm, selectedCategory, categories]);  

  const fetchProducts = async () => {  
    const querySnapshot = await getDocs(collection(db, "produtos"));  
    const allProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));  
    setProducts(allProducts);  
  };  

  const fetchCategories = async () => {  
    const querySnapshot = await getDocs(collection(db, "categorias"));  
    const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));  
    setCategories(cats);  
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
    const { id, title, price, sizes, images, destaque, categories } = editProduct;  

    await setDoc(  
      doc(db, "produtos", id),  
      {  
        title,  
        price,  
        sizes,  
        images,  
        destaque: destaque ?? false,  
        categories: categories || [],  
      },  
      { merge: true }  
    );  

    setModalOpen(false);  
    setEditProduct(null);  
    fetchProducts();  
  };  

  const modalVariants = {  
    hidden: { scale: 0.8, opacity: 0 },  
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },  
    exit: { scale: 0.8, opacity: 0 }  
  };  

  const getCategoryCount = (catId) => {  
    return products.filter(prod =>  
      prod.categories?.some(cat => cat === categories.find(c => c.id === catId)?.name)  
    ).length;  
  };  

  return (  
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-white to-gray-50">  
      <motion.div  
        className="max-w-6xl mx-auto"  
        initial={{ opacity: 0 }}  
        animate={{ opacity: 1 }}  
        transition={{ duration: 0.5 }}  
      >  
        <motion.h1  
          className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3"  
          initial={{ y: -20 }}  
          animate={{ y: 0 }}  
          transition={{ delay: 0.2 }}  
        >  
          Gerenciar Produtos  
        </motion.h1>  
        <p className="text-gray-600 mb-8">Organize, edite e destaque seus produtos com facilidade.</p>  

        {/* Busca e Filtros */}  
        <div className="flex flex-col md:flex-row gap-4 mb-8">  
          <motion.div  
            className="relative flex-1"  
            initial={{ scale: 0.95 }}  
            animate={{ scale: 1 }}  
          >  
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />  
            <input  
              type="text"  
              placeholder="Busque por título do produto..."  
              value={searchTerm}  
              onChange={(e) => setSearchTerm(e.target.value)}  
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all"  
            />  
          </motion.div>  

          <motion.div  
            className="relative"  
            initial={{ scale: 0.95 }}  
            animate={{ scale: 1 }}  
          >  
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />  
            <select  
              value={selectedCategory}  
              onChange={(e) => setSelectedCategory(e.target.value)}  
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all"  
            >  
              <option value="all">Todas Categorias</option>  
              {categories.map(cat => (  
                <option key={cat.id} value={cat.id}>  
                  {cat.name} ({getCategoryCount(cat.id)})  
                </option>  
              ))}  
            </select>  
          </motion.div>  
        </div>  

        {/* Lista de produtos */}  
        <AnimatePresence>  
          {filteredProducts.length > 0 ? (  
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">  
              {filteredProducts.map((prod, index) => (  
                <motion.div  
                  key={prod.id}  
                  initial={{ opacity: 0, y: 20 }}  
                  animate={{ opacity: 1, y: 0 }}  
                  exit={{ opacity: 0, y: -20 }}  
                  transition={{ duration: 0.4, delay: index * 0.05 }}  
                  whileHover={{ y: -5, scale: 1.02 }}  
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200/50 hover:shadow-2xl transition-all duration-300"  
                >  
                  {/* Imagem principal */}  
                  {prod.images && prod.images[0] && (  
                    <div className="h-48 bg-gray-100 flex items-center justify-center">  
                      <img  
                        src={prod.images[0]}  
                        alt={prod.title}  
                        className="w-full h-full object-cover"  
                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} // fallback  
                      />  
                    </div>  
                  )}  
                  <div className="p-6">  
                    <div className="flex items-start justify-between mb-3">  
                      <h3 className="font-bold text-xl text-gray-900 flex-1 pr-2 line-clamp-2">  
                        {prod.title}  
                      </h3>  
                      {prod.destaque && (  
                        <motion.div  
                          whileHover={{ scale: 1.1 }}  
                          className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold"  
                        >  
                          <Star className="w-3 h-3 inline ml-1" /> Destaque  
                        </motion.div>  
                      )}  
                    </div>  

                    <p className="text-2xl font-bold text-green-600 mb-3">R$ {prod.price}</p>  

                    {prod.productLink && (  
                      <p className="text-gray-500 text-sm mb-3 truncate">  
                        <a href={prod.productLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">  
                          Ver no site  
                        </a>  
                      </p>  
                    )}  

                    {/* Tamanhos */}  
                    {prod.sizes && prod.sizes.length > 0 && (  
                      <div className="mb-3">  
                        <p className="text-gray-600 text-sm font-medium mb-2">Tamanhos:</p>  
                        <div className="flex flex-wrap gap-2">  
                          {prod.sizes.map((size, idx) => (  
                            <span  
                              key={idx}  
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"  
                            >  
                              {size}  
                            </span>  
                          ))}  
                        </div>  
                      </div>  
                    )}  

                    {/* Categorias */}  
                    {prod.categories && prod.categories.length > 0 && (  
                      <div className="mb-3">  
                        <p className="text-gray-600 text-sm font-medium mb-2">Categorias:</p>  
                        <div className="flex flex-wrap gap-2">  
                          {prod.categories.map((cat, idx) => (  
                            <span  
                              key={idx}  
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"  
                            >  
                              {cat}  
                            </span>  
                          ))}  
                        </div>  
                      </div>  
                    )}  

                    {/* Botões */}  
                    <div className="flex justify-end gap-2">  
                      <motion.button  
                        onClick={() => handleToggleDestaque(prod)}  
                        whileHover={{ scale: 1.1 }}  
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${  
                          prod.destaque  
                            ? "bg-yellow-400 text-black hover:bg-yellow-300"  
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"  
                        }`}  
                      >  
                        <Star className="w-4 h-4 inline mr-1" /> {prod.destaque ? "Remover" : "Destaque"}  
                      </motion.button>  
                      <motion.button  
                        onClick={() => handleEdit(prod)}  
                        whileHover={{ scale: 1.1 }}  
                        className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"  
                      >  
                        <Edit className="w-4 h-4 inline mr-1" /> Editar  
                      </motion.button>  
                      <motion.button  
                        onClick={() => handleDelete(prod.id)}  
                        whileHover={{ scale: 1.1 }}  
                        className="px-3 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all"  
                      >  
                        <Trash2 className="w-4 h-4 inline mr-1" /> Deletar  
                      </motion.button>  
                    </div>  
                  </div>  
                </motion.div>  
              ))}  
            </div>  
          ) : (  
            <motion.div  
              className="text-center py-12"  
              initial={{ opacity: 0 }}  
              animate={{ opacity: 1 }}  
            >  
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />  
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>  
              <p className="text-gray-500">Tente ajustar a busca ou o filtro.</p>  
            </motion.div>  
          )}  
        </AnimatePresence>  
      </motion.div>  

      {/* Modal de edição */}  
      <AnimatePresence>  
        {modalOpen && (  
          <motion.div  
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"  
            initial={{ opacity: 0 }}  
            animate={{ opacity: 1 }}  
            exit={{ opacity: 0 }}  
            onClick={() => setModalOpen(false)}  
          >  
            <motion.div  
              variants={modalVariants}  
              initial="hidden"  
              animate="visible"  
              exit="exit"  
              onClick={(e) => e.stopPropagation()}  
              className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"  
            >  
              <div className="flex justify-between items-center mb-6">  
                <h2 className="text-2xl font-bold text-gray-900">Editar Produto</h2>  
                <motion.button  
                  onClick={() => { setModalOpen(false); setEditProduct(null); }}  
                  whileHover={{ scale: 1.1 }}  
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"  
                >  
                  <X className="w-6 h-6" />  
                </motion.button>  
              </div>  

              {editProduct && (  
                <>  
                  <div className="space-y-6">  
                    <div>  
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>  
                      <input  
                        type="text"  
                        className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"  
                        value={editProduct.title || ""}  
                        onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}  
                      />  
                    </div>  

                    <div>  
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Preço</label>  
                      <input  
                        type="text"  
                        className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"  
                        value={editProduct.price || ""}  
                        onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}  
                      />  
                    </div>  

                    <div>  
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Categorias</label>  
                      <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-2xl">  
                        {categories.map((cat) => (  
                          <motion.label  
                            key={cat.id}  
                            whileHover={{ scale: 1.05 }}  
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 shadow-sm"  
                          >  
                            <input  
                              type="checkbox"  
                              checked={editProduct.categories?.includes(cat.name)}  
                              onChange={(e) => {  
                                const updatedCategories = e.target.checked  
                                  ? [...(editProduct.categories || []), cat.name]  
                                  : editProduct.categories?.filter(c => c !== cat.name) || [];  
                                setEditProduct({ ...editProduct, categories: updatedCategories });  
                              }}  
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"  
                            />  
                            <span className="text-gray-700 font-medium">{cat.name}</span>  
                          </motion.label>  
                        ))}  
                      </div>  
                    </div>  
                  </div>  

                  <motion.div  
                    className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200"  
                    initial={{ opacity: 0 }}  
                    animate={{ opacity: 1 }}  
                    transition={{ delay: 0.2 }}  
                  >  
                    <motion.button  
                      onClick={() => { setModalOpen(false); setEditProduct(null); }}  
                      whileHover={{ scale: 1.05 }}  
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all"  
                    >  
                      Cancelar  
                    </motion.button>  
                    <motion.button  
                      onClick={handleSaveEdit}  
                      whileHover={{ scale: 1.05 }}  
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"  
                    >  
                      Salvar Alterações  
                    </motion.button>  
                  </motion.div>  
                </>  
              )}  
            </motion.div>  
          </motion.div>  
        )}  
      </AnimatePresence>  
    </div>  
  );  
};  

export default GerenciarProdutos;