import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import ProdutoCard from "../components/ProdutoCard"; // importe o card

const CategoriaProdutos = () => {
  const { nome } = useParams(); // pega a categoria da URL
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const q = query(
        collection(db, "produtos"),
        where("categories", "array-contains", nome) // busca dentro do array de categorias
      );
      const querySnapshot = await getDocs(q);
      const prods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(prods);
    };

    fetchProdutos();
  }, [nome]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Produtos: {nome}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {produtos.map(prod => (
          <ProdutoCard key={prod.id} produto={prod} />
        ))}
      </div>
    </div>
  );
};

export default CategoriaProdutos;
