import React, { useEffect, useState } from "react";  
import { motion } from "framer-motion";  
import { auth } from "../config/firebase"; // seu firebase.js  
import { onAuthStateChanged, signOut, updateProfile, sendEmailVerification } from "firebase/auth";  
import { useNavigate } from "react-router-dom";  
import { User, Mail, Calendar, LogIn, Shield, Edit, Loader2 } from "lucide-react";  
import { format, parseISO, isValid } from "date-fns";  
import { ptBR } from "date-fns/locale";  

const Perfil = () => {  
    const [user, setUser] = useState(null);  
    const [displayName, setDisplayName] = useState("");  
    const [isEditing, setIsEditing] = useState(false);  
    const [isLoading, setIsLoading] = useState(false);  
    const navigate = useNavigate();  

    function formatFirebaseDate(dateStr) {  
        if (!dateStr) return "Não disponível";  
        const parsed = parseISO(dateStr);  
        if (!isValid(parsed)) return "Não disponível";  
        return format(parsed, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });  
    }  

    // Lista de emails que podem acessar o admin  
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS  
        ? import.meta.env.VITE_ADMIN_EMAILS.split(",")  
        : [];  

    // Observa usuário logado  
    useEffect(() => {  
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {  
            if (currentUser) {  
                setUser(currentUser);  
                setDisplayName(currentUser.displayName || "");  
            } else {  
                navigate("/login"); // se não estiver logado, redireciona  
            }  
        });  
        return () => unsubscribe();  
    }, [navigate]);  

    const handleLogout = async () => {  
        setIsLoading(true);  
        await signOut(auth);  
        navigate("/login");  
    };  

    const handleUpdateProfile = async () => {  
        if (!displayName.trim()) return;  
        setIsLoading(true);  
        try {  
            await updateProfile(auth.currentUser, { displayName });  
            await refreshUser(); // atualiza o estado do usuário  
            setIsEditing(false);  
            alert("Nome atualizado com sucesso! 💪");  
        } catch (error) {  
            console.error(error);  
            alert("Erro ao atualizar o nome. Tente novamente.");  
        } finally {  
            setIsLoading(false);  
        }  
    };  

    const handleSendVerification = async () => {  
        if (user && !user.emailVerified) {  
            try {  
                await sendEmailVerification(user);  
                alert("Email de verificação enviado! 📧 Verifique sua caixa de entrada.");  

                // Opcional: atualizar o usuário após alguns segundos para refletir a verificação  
                setTimeout(refreshUser, 3000);  
            } catch (error) {  
                console.error(error);  
                alert("Erro ao enviar email de verificação. Tente novamente.");  
            }  
        }  
    };  

    const handleAdminAccess = () => {  
        navigate("/admin");  
    };  

    if (!user) {  
        return (  
            <div className="min-h-screen flex items-center justify-center p-4">  
                <motion.div  
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}  
                    className="flex flex-col sm:flex-row items-center gap-2 text-gray-500"  
                >  
                    <Loader2 className="w-6 h-6" />  
                    <span className="text-sm">Carregando perfil...</span>  
                </motion.div>  
            </div>  
        );  
    }  
    const refreshUser = async () => {  
        if (auth.currentUser) {  
            await auth.currentUser.reload(); // força o Firebase a atualizar os dados do usuário  
            setUser({ ...auth.currentUser }); // atualiza o estado com os novos dados  
            setDisplayName(auth.currentUser.displayName || "");  
        }  
    };  

    const isAdmin = adminEmails.includes(user.email);  

    // Formatar datas  
    const creationDate = formatFirebaseDate(user.metadata.creationTime);  
    const lastLogin = formatFirebaseDate(user.metadata.lastSignInTime);  

    // Provedor (simples detecção)  
    const provider = user.providerData[0]?.providerId === "google.com" ? "Google" : "Email/Senha";  

    // Ícone ou foto responsivo  
    const ProfileAvatar = () => (  
        <div className="relative flex justify-center">  
            {user.photoURL ? (  
                <motion.img  
                    src={user.photoURL}  
                    alt="Foto de Perfil"  
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-3 sm:border-4 border-white shadow-lg"  
                    whileHover={{ scale: 1.05 }}  
                    transition={{ duration: 0.3 }}  
                />  
            ) : (  
                <motion.div  
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-3xl shadow-lg border-3 sm:border-4 border-white"  
                    whileHover={{ scale: 1.05, rotate: 5 }}  
                    transition={{ duration: 0.3 }}  
                >  
                    <User className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />  
                </motion.div>  
            )}  
            <motion.div  
                className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 md:-bottom-2 md:-right-2 bg-green-500 p-1 sm:p-1.5 md:p-2 rounded-full border-3 sm:border-4 border-white shadow-lg"  
                initial={{ scale: 0 }}  
                animate={{ scale: 1 }}  
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}  
            >  
                <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-5 md:h-5 text-white" />  
            </motion.div>  
        </div>  
    );  

    return (  
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-2 sm:p-4 md:py-6 md:p-8 lg:py-8">  
            <motion.div  
                initial={{ opacity: 0, y: 20 }}  
                animate={{ opacity: 1, y: 0 }}  
                transition={{ duration: 0.6 }}  
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl px-2 sm:px-4"  
            >  
                {/* Título responsivo */}  
                <motion.h1  
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight"  
                    initial={{ scale: 0.9 }}  
                    animate={{ scale: 1 }}  
                    transition={{ delay: 0.2 }}  
                >  
                    Meu Perfil 💪  
                </motion.h1>  

                {/* Card Principal responsivo */}  
                <motion.div  
                    className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden border border-gray-200/50 w-full"  
                    initial={{ opacity: 0, y: 30 }}  
                    animate={{ opacity: 1, y: 0 }}  
                    transition={{ delay: 0.3 }}  
                >  
                    {/* Header com Avatar centralizado em mobile */}  
                    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">  
                        <div className="absolute inset-0 bg-black/10" />  
                        <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3 md:gap-4">  
                            <ProfileAvatar />  
                            <div className="text-center px-1 sm:px-2">  
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate w-full max-w-xs sm:max-w-none">{displayName || "Usuário Anônimo"}</h2>  
                                <p className="text-blue-100 opacity-90 text-xs sm:text-sm">{provider} Auth</p>  
                            </div>  
                        </div>  
                    </div>  

                    {/* Corpo com Infos responsivo */}  
                    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6">  
                        {/* Infos Básicas - Grid responsivo */}  
                        <motion.div  
                            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4"  
                            initial={{ opacity: 0 }}  
                            animate={{ opacity: 1 }}  
                            transition={{ delay: 0.4 }}  
                        >  
                            <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">  
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">  
                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />  
                                    <span className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">Email</span>  
                                </div>  
                                <p className="text-xs sm:text-sm text-gray-900 break-words overflow-hidden line-clamp-2">{user.email}</p>  
                                <div className="flex items-center gap-1 mt-1 sm:mt-2 flex-wrap">  
                                    {user.emailVerified ? (  
                                        <motion.span  
                                            className="text-green-600 text-xs font-medium flex items-center gap-1"  
                                            initial={{ scale: 0 }}  
                                            animate={{ scale: 1 }}  
                                        >  
                                            <Calendar className="w-3 h-3" /> Verificado  
                                        </motion.span>  
                                    ) : (  
                                        <div className="flex gap-1.5 sm:gap-2 items-center flex-wrap mt-1">  
                                            <span className="text-yellow-600 text-xs">Não verificado</span>  
                                            <button  
                                                onClick={handleSendVerification}  
                                                className="px-2 py-1.5 sm:px-3 sm:py-1.5 bg-yellow-500 text-black text-xs rounded-md hover:bg-yellow-400 transition whitespace-nowrap min-h-[32px] sm:min-h-[36px]"  
                                            >  
                                                Enviar Verificação  
                                            </button>  
                                        </div>  
                                    )}  
                                </div>  
                            </div>  

                            <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">  
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">  
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />  
                                    <span className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">Conta Criada</span>  
                                </div>  
                                <p className="text-xs sm:text-sm text-gray-900 line-clamp-2">{creationDate}</p>  
                            </div>  

                            <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">  
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">  
                                    <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />  
                                    <span className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">Último Login</span>  
                                </div>  
                                <p className="text-xs sm:text-sm text-gray-900 line-clamp-2">{lastLogin}</p>  
                            </div>  

                            <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:col-span-2">  
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">  
                                    {isAdmin ? (  
                                        <>  
                                            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />  
                                            <span className="font-semibold text-blue-700 text-xs sm:text-sm md:text-base">Nível de Acesso</span>  
                                        </>  
                                    ) : (  
                                        <>  
                                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />  
                                            <span className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base">Tipo de Conta</span>  
                                        </>  
                                    )}  
                                </div>  
                                <p className="text-xs sm:text-sm text-gray-900">  
                                    {isAdmin ? "Admin - Acesso Total" : "Usuário Padrão"}  
                                </p>  
                            </div>  
                        </motion.div>  

                        {/* Edição de Nome - Responsivo */}  
                        <motion.div  
                            className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-blue-200"  
                            initial={{ opacity: 0, height: 0 }}  
                            animate={{ opacity: 1, height: "auto" }}  
                            transition={{ delay: 0.5, duration: 0.5 }}  
                        >  
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">  
                                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />  
                                <h3 className="font-semibold text-blue-800 text-xs sm:text-sm md:text-base">Editar Nome de Exibição</h3>  
                            </div>  
                            <div className="flex flex-col gap-2 sm:gap-3">  
                                <input  
                                    type="text"  
                                    className="px-3 py-3 sm:px-4 rounded-lg sm:rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 text-sm w-full min-h-[40px] sm:min-h-[44px]"  
                                    value={displayName}  
                                    onChange={(e) => setDisplayName(e.target.value)}  
                                    placeholder="Digite seu nome preferido"  
                                />  
                                {isEditing ? (  
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">  
                                        <button  
                                            onClick={handleUpdateProfile}  
                                            disabled={isLoading || !displayName.trim()}  
                                            className="px-3 py-3 sm:px-4 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed min-h-[40px] sm:min-h-[44px] text-sm"  
                                        >  
                                            {isLoading ? (  
                                                <>  
                                                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />  
                                                    Salvando...  
                                                </>  
                                            ) : (  
                                                "Salvar"  
                                            )}  
                                        </button>  
                                        <button  
                                            onClick={() => { setIsEditing(false); setDisplayName(user.displayName || ""); }}  
                                            className="px-3 py-3 sm:px-4 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 min-h-[40px] sm:min-h-[44px] text-sm"  
                                        >  
                                            Cancelar  
                                        </button>  
                                    </div>  
                                ) : (  
                                    <button  
                                        onClick={() => setIsEditing(true)}  
                                        className="px-3 py-3 sm:px-4 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 min-h-[40px] sm:min-h-[44px] text-sm"  
                                    >  
                                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />  
                                        Editar  
                                    </button>  
                                )}  
                            </div>  
                        </motion.div>  

                        {/* Botões de Ação - Stack em mobile */}  
                        <motion.div  
                            className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-3 md:pt-4"  
                            initial={{ opacity: 0 }}  
                            animate={{ opacity: 1 }}  
                            transition={{ delay: 0.6 }}  
                        >  
                            {isAdmin && (  
                                <button  
                                    onClick={handleAdminAccess}  
                                    className="flex-1 px-3 py-3 sm:px-4 sm:py-3 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-h-[40px] sm:min-h-[44px] text-sm"  
                                >  
                                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />  
                                    <span className="whitespace-nowrap">Painel Admin</span>  
                                </button>  
                            )}  
                            <button  
                                onClick={handleLogout}  
                                disabled={isLoading}  
                                className="flex-1 px-3 py-3 sm:px-4 sm:py-3 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-h-[40px] sm:min-h-[44px] text-sm"  
                            >  
                                {isLoading ? (  
                                    <>  
                                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin flex-shrink-0" />  
                                        <span className="whitespace-nowrap">Saindo...</span>  
                                    </>  
                                ) : (  
                                    <>  
                                        <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rotate-180 flex-shrink-0" />  
                                        <span className="whitespace-nowrap">Sair</span>  
                                    </>  
                                )}  
                            </button>  
                        </motion.div>  
                    </div>  
                </motion.div>  

                {/* Rodapé motivacional - Centralizado sempre */}  
                <motion.p  
                    className="text-center text-gray-600 mt-3 sm:mt-4 md:mt-6 italic text-xs sm:text-sm md:text-base px-2 leading-relaxed"  
                    initial={{ opacity: 0 }}  
                    animate={{ opacity: 1 }}  
                    transition={{ delay: 0.7 }}  
                >  
                    Continue evoluindo com Dinna Fitness! 🚀  
                </motion.p>  
            </motion.div>  
        </div>  
    );  
};  

export default Perfil;