import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Edit3 } from "lucide-react";
import { useEffect } from "react";
const DashboardProdutos = () => {
  useEffect(() => {
      document.title = "Dashboard - Produtos"; // muda o título da aba do navegador
    }, []);
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-screen">
      {/* Card Gerenciar Produtos */}
      <Link
        to="/admin/produtos/gerenciar"
        className="bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-700"
      >
        <Edit3 className="w-12 h-12 text-white mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Gerenciar Produtos</h3>
        <p className="text-gray-300 text-sm">Edite, exclua ou visualize produtos existentes</p>
      </Link>

      {/* Card Novo Produto */}
      <Link
        to="/admin/produtos/novo"
        className="bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-700"
      >
        <PlusCircle className="w-12 h-12 text-white mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Novo Produto</h3>
        <p className="text-gray-300 text-sm">Adicione um novo produto ao catálogo</p>
      </Link>
    </div>
  );
};

export default DashboardProdutos;
