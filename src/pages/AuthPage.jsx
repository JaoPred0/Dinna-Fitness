import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase"; // ajuste o path conforme sua pasta
const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleForm = () => {
        setIsRegister(!isRegister);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegister) {
                await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                alert("Cadastro realizado com sucesso!");
            } else {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                alert("Login realizado com sucesso!");
            }

            window.location.href = "/"; // redireciona
        } catch (error) {
            console.error(error);
            alert("Erro: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Salvar sessão (se quiser)
            localStorage.setItem("auth", JSON.stringify(user));

            alert(`Bem-vindo, ${user.displayName}!`);
            // redirecionar
            window.location.href = "/";
        } catch (error) {
            console.error("Erro no login com Google:", error);
            alert("Falha ao entrar com Google!");
        }
    };


    const formVariants = {
        hidden: { opacity: 0, x: isRegister ? 50 : -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isRegister ? -50 : 50 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center py-8 px-4 ">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-md">
                {/* Imagem lateral */}
                <div className="lg:w-1/2 bg-gradient-to-br from-purple-500 to-pink-600 relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Fitness Motivation"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-8 left-8 text-blue-700">
                        <h2 className="text-3xl font-bold mb-2">Junte-se à Dinna Fitness</h2>
                        <p className="text-lg opacity-90">Alcance seus objetivos com nós!</p>
                    </div>
                </div>

                {/* Formulário */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <motion.div
                        key={isRegister ? "register" : "login"}
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="space-y-6"
                    >
                        {/* Toggle */}
                        <div className="flex justify-center">
                            <motion.button
                                onClick={toggleForm}
                                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${isRegister
                                    ? "bg-gray-200 text-gray-700 shadow-md"
                                    : "bg-purple-500 text-white shadow-lg hover:shadow-xl"
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isRegister ? "Já tem conta? Entrar" : "Criar Nova Conta"}
                            </motion.button>
                        </div>

                        {/* Título */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-800">
                            {isRegister ? "Cadastre-se" : "Faça Login"}
                        </h1>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isRegister && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Seu nome"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: isRegister ? 0.2 : 0.1 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="seu@email.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: isRegister ? 0.3 : 0.2 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Senha segura"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {isRegister && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirme sua senha"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Botão Submit */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        {isRegister ? "Cadastrar" : "Entrar"}
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="relative text-center text-gray-500 my-6">
                            <span className="px-4 bg-white">ou</span>
                            <div className="absolute inset-0 w-full h-0.5 bg-gray-300 top-1/2" />
                        </div>

                        {/* Google Button */}
                        <motion.button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 hover:border-gray-400 bg-white rounded-xl font-semibold text-gray-700 transition-all duration-300 hover:shadow-md"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaGoogle className="w-5 h-5 text-red-500" />
                            Continuar com Google
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;