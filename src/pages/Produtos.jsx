import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import ProdutoCard from "../components/ProdutoCard";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filtros
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]); // min e max

  useEffect(() => {
    fetchProdutos();
    fetchCategories();
  }, []);

  const fetchProdutos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(lista);
      setFilteredProdutos(lista);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categorias"));
      const lista = querySnapshot.docs.map((doc) => doc.data());
      setCategories(lista);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  // Função de filtragem
  useEffect(() => {
    let temp = [...produtos];

    // Filtrar por pesquisa
    if (search) {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (selectedCategory) {
      temp = temp.filter((p) =>
        p.categories?.includes(selectedCategory)
      );
    }

    // Filtrar por preço
    temp = temp.filter((p) => {
      const price = parseFloat(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFilteredProdutos(temp);
  }, [search, selectedCategory, priceRange, produtos]);

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Produtos</h2>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md flex-1"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Todas categorias</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Preço min"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            className="p-2 border border-gray-300 rounded-md w-24"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Preço max"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="p-2 border border-gray-300 rounded-md w-24"
          />
        </div>
      </div>

      {filteredProdutos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProdutos.map((prod) => (
            <ProdutoCard key={prod.id} produto={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Produtos;
