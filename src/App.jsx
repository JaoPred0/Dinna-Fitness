// App.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/navigation";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DashboardAdmin from "./admin/pages/DashboardAdmin";
import AuthPage from "./pages/AuthPage";
import Perfil from "./pages/Perfil"; // Corrigido
import DashboardLayout from "./components/DashboardLayout";
import DashboardSite from "./admin/pages/DashboardSite";
import Produtos from "./pages/Produtos";
import Footer from "./components/Footer";
import DashboardProdutos from "./admin/pages/DashboardProdutos";
import GerenciarProdutos from "./admin/pages/GerenciarProdutos";
import NovoProduto from "./admin/pages/NovoProduto";
import ProdutoPage from "./components/ProdutoPage";
import Carrinho from "./pages/Carrinho";
import CategoriaProdutos from "./pages/CategoriaProdutos";
import NotFound from "./pages/NotFound";
import Contato from "./pages/Contato";

// === Contexto de Autenticação ===
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent border-solid rounded-full animate-spin mb-6"></div>
        {/* Texto */}
        <p className="text-gray-700 text-lg font-semibold animate-pulse">
          Carregando sua sessão...
        </p>
      </div>
    );

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

// === Layouts ===
const MainLayout = ({ children }) => {

  return (
    <>
      <Navbar />

      {/* Espaçador automático */}
      {/* <div style={{ height: headerHeight }} /> */}
      {/* responsivo */}
      <main className="mt-25 sm:mt-35 lg:mt-35">{children}</main>
      <Footer />
    </>
  );
};

const AdminLayout = ({ children }) => <main>{children}</main>;

// === Rotas Privadas ===
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};


const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS
    ? import.meta.env.VITE_ADMIN_EMAILS.split(",").map((email) => email.trim())
    : [];

  if (!user) return <Navigate to="/login" />;
  if (!adminEmails.includes(user.email)) return <Navigate to="/" />;
  return children;
};


// === App ===
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<MainLayout><AuthPage /></MainLayout>} />
          <Route path="/cadastro" element={<MainLayout><AuthPage /></MainLayout>} />
          <Route path="/produtos" element={<MainLayout><Produtos /></MainLayout>} />
          <Route path="/produtos/:id" element={<MainLayout><ProdutoPage /></MainLayout>} />
          <Route path="/carrinho" element={<MainLayout><Carrinho /></MainLayout>} />
          <Route path="/categoria/:nome" element={<MainLayout><CategoriaProdutos /></MainLayout>} />
          <Route path="/contato" element={<MainLayout><Contato /></MainLayout>} />
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          {/* Perfil (usuário logado) */}
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <MainLayout><Perfil /></MainLayout>
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <DashboardLayout>
                    <DashboardAdmin />
                  </DashboardLayout>
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/site"
            element={
              <AdminRoute>
                <AdminLayout>
                  <DashboardLayout>
                    <DashboardSite />
                  </DashboardLayout>
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/produtos"
            element={
              <AdminRoute>
                <AdminLayout>
                  <DashboardLayout>
                    <DashboardProdutos />
                  </DashboardLayout>
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/produtos/gerenciar"
            element={
              <AdminRoute>
                <AdminLayout>
                  <DashboardLayout>
                    <GerenciarProdutos />
                  </DashboardLayout>
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/produtos/novo"
            element={
              <AdminRoute>
                <AdminLayout>
                  <DashboardLayout>
                    <NovoProduto />
                  </DashboardLayout>
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
