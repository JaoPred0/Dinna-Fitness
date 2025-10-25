import React, { useEffect, useState } from "react";  
import { db } from "../config/firebase";  
import { doc, getDoc, setDoc } from "firebase/firestore";  
import { motion } from "framer-motion";  
import { Save, RefreshCw, ArrowLeft, Edit3, Eye, EyeOff, Clock } from "lucide-react";  
import { useNavigate } from "react-router-dom";  

const DashboardNavbarEdit = () => {  
    const navigate = useNavigate();  

    const [bannerText, setBannerText] = useState("");  
    const [bgColor, setBgColor] = useState("#047857");  
    const [textColor, setTextColor] = useState("#ffffff");  
    const [isVisible, setIsVisible] = useState(true);  
    const [useTimer, setUseTimer] = useState(false);  
    const [timeLeft, setTimeLeft] = useState(300); // segundos  
    const [inputMinutes, setInputMinutes] = useState(5); // campo de input  
    const [isSaving, setIsSaving] = useState(false);  

    // Carrega dados do Firestore ou localStorage  
    useEffect(() => {  
        const loadData = async () => {  
            const local = localStorage.getItem("bannerConfig");  
            if (local) {  
                const cfg = JSON.parse(local);  
                setBannerText(cfg.bannerText || "");  
                setBgColor(cfg.bgColor || "#047857");  
                setTextColor(cfg.textColor || "#ffffff");  
                setIsVisible(cfg.isVisible ?? true);  
                setUseTimer(cfg.useTimer ?? false);  
                setTimeLeft(cfg.timeLeft ?? 300);  
                setInputMinutes(Math.floor((cfg.timeLeft ?? 300) / 60));  
            } else {  
                const snap = await getDoc(doc(db, "config", "site"));  
                if (snap.exists() && snap.data().bannerConfig) {  
                    const cfg = snap.data().bannerConfig;  
                    setBannerText(cfg.bannerText || "");  
                    setBgColor(cfg.bgColor || "#047857");  
                    setTextColor(cfg.textColor || "#ffffff");  
                    setIsVisible(cfg.isVisible ?? true);  
                    setUseTimer(cfg.useTimer ?? false);  
                    setTimeLeft(cfg.timeLeft ?? 300);  
                    setInputMinutes(Math.floor((cfg.timeLeft ?? 300) / 60));  
                }  
            }  
        };  
        loadData();  
    }, []);  

    // Atualiza timer quando digita minutos  
    useEffect(() => {  
        setTimeLeft(inputMinutes * 60);  
    }, [inputMinutes]);  

    // Timer regressivo opcional  
    useEffect(() => {  
        if (!useTimer || !isVisible || timeLeft <= 0) return;  
        const timer = setInterval(() => {  
            setTimeLeft((t) => {  
                const newTime = t - 1;  
                localStorage.setItem(  
                    "bannerConfig",  
                    JSON.stringify({ bannerText, bgColor, textColor, isVisible, useTimer, timeLeft: newTime })  
                );  
                return newTime;  
            });  
        }, 1000);  
        return () => clearInterval(timer);  
    }, [useTimer, isVisible, timeLeft, bannerText, bgColor, textColor]);  

    const handleSave = async () => {  
        setIsSaving(true);  
        const config = { bannerText, bgColor, textColor, isVisible, useTimer, timeLeft };  
        try {  
            const docRef = doc(db, "config", "site");  
            await setDoc(docRef, { bannerConfig: config }, { merge: true });  
            localStorage.setItem("bannerConfig", JSON.stringify(config));  
            alert("Configurações salvas com sucesso! ✅");  
        } catch (error) {  
            console.error(error);  
            alert("Erro ao salvar.");  
        } finally {  
            setIsSaving(false);  
        }  
    };  

    const resetTimer = () => setTimeLeft(inputMinutes * 60);  

    const formatTime = (s) => {  
        const m = Math.floor(s / 60).toString().padStart(2, "0");  
        const sec = (s % 60).toString().padStart(2, "0");  
        return `${m}:${sec}`;  
    };  

    const visibilityIcon = isVisible ? Eye : EyeOff;  
    const VisibilityIcon = visibilityIcon;  

    return (  
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6 md:p-8">  
            <div className="max-w-4xl mx-auto">  
                <div className="flex justify-between items-center mb-8">  
                    <motion.h2  
                        className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3"  
                        initial={{ opacity: 0, y: -20 }}  
                        animate={{ opacity: 1, y: 0 }}  
                        transition={{ duration: 0.6 }}  
                    >  
                        <Edit3 className="w-8 h-8" /> Configurar Banner Superior  
                    </motion.h2>  

                    <motion.button  
                        onClick={() => navigate("/admin/site")}  
                        className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl"  
                        whileHover={{ scale: 1.05 }}  
                        whileTap={{ scale: 0.95 }}  
                    >  
                        <ArrowLeft className="w-5 h-5" /> Voltar  
                    </motion.button>  
                </div>  

                {/* Preview com visibilidade toggle */}  
                <motion.div  
                    className="relative mb-8"  
                    initial={{ opacity: 0, y: 20 }}  
                    animate={{ opacity: 1, y: 0 }}  
                    transition={{ duration: 0.5, delay: 0.2 }}  
                >  
                    <div className="flex items-center justify-between mb-3">  
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">Preview do Banner</h3>  
                        <motion.button  
                            onClick={() => setIsVisible(!isVisible)}  
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-200"  
                            whileHover={{ scale: 1.05 }}  
                            whileTap={{ scale: 0.95 }}  
                        >  
                            <VisibilityIcon className="w-4 h-4" /> {isVisible ? "Ocultar" : "Mostrar"}  
                        </motion.button>  
                    </div>  

                    {isVisible && (  
                        <motion.div  
                            className="text-center py-5 px-6 font-bold rounded-3xl shadow-xl border border-gray-200/50 w-full"  
                            style={{ backgroundColor: bgColor, color: textColor }}  
                            initial={{ scale: 0.95, opacity: 0 }}  
                            animate={{ scale: 1, opacity: 1 }}  
                            transition={{ duration: 0.4 }}  
                            whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}  
                        >  
                            {bannerText || "Digite algo incrível aqui..."} {" "}  
                            {useTimer && (  
                                <motion.span  
                                    className="ml-3 px-3 py-1 bg-white/20 rounded-full inline-flex items-center gap-1"  
                                    initial={{ scale: 0 }}  
                                    animate={{ scale: 1 }}  
                                    transition={{ delay: 0.3, type: "spring" }}  
                                >  
                                    <Clock className="w-4 h-4" /> {formatTime(timeLeft)}  
                                </motion.span>  
                            )}  
                        </motion.div>  
                    )}  
                </motion.div>  

                {/* Configurações Formulário */}  
                <motion.div  
                    className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200/50 space-y-8"  
                    initial={{ opacity: 0, y: 20 }}  
                    animate={{ opacity: 1, y: 0 }}  
                    transition={{ duration: 0.6, delay: 0.3 }}  
                >  
                    {/* Texto */}  
                    <div>  
                        <label className="block font-semibold text-gray-800 mb-3 text-lg">Texto do Banner</label>  
                        <textarea  
                            value={bannerText}  
                            onChange={(e) => setBannerText(e.target.value)}  
                            rows={4}  
                            placeholder="Digite a mensagem que vai aparecer no topo do site..."  
                            className="w-full p-5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-300 shadow-sm hover:shadow-md"  
                        />  
                    </div>  

                    {/* Cores */}  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
                        <motion.div  
                            initial={{ opacity: 0, x: -20 }}  
                            animate={{ opacity: 1, x: 0 }}  
                            transition={{ duration: 0.5 }}  
                        >  
                            <label className="block font-semibold text-gray-800 mb-3 text-lg">Cor de Fundo</label>  
                            <input  
                                type="color"  
                                value={bgColor}  
                                onChange={(e) => setBgColor(e.target.value)}  
                                className="w-full h-12 rounded-2xl cursor-pointer border-2 border-gray-300 shadow-sm hover:shadow-md transition-all duration-300"  
                            />  
                            <div className="h-4 bg-current rounded mt-2" style={{ backgroundColor: bgColor }} />  
                        </motion.div>  
                        <motion.div  
                            initial={{ opacity: 0, x: 20 }}  
                            animate={{ opacity: 1, x: 0 }}  
                            transition={{ duration: 0.5, delay: 0.1 }}  
                        >  
                            <label className="block font-semibold text-gray-800 mb-3 text-lg">Cor do Texto</label>  
                            <input  
                                type="color"  
                                value={textColor}  
                                onChange={(e) => setTextColor(e.target.value)}  
                                className="w-full h-12 rounded-2xl cursor-pointer border-2 border-gray-300 shadow-sm hover:shadow-md transition-all duration-300"  
                            />  
                            <div className="h-4 bg-current rounded mt-2" style={{ backgroundColor: textColor, color: '#000' }} />  
                        </motion.div>  
                    </div>  

                    {/* Visibilidade e Timer */}  
                    <motion.div  
                        initial={{ opacity: 0, y: 20 }}  
                        animate={{ opacity: 1, y: 0 }}  
                        transition={{ duration: 0.5, delay: 0.2 }}  
                        className="space-y-4"  
                    >  

                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">  
                            <label className="flex items-center gap-3 cursor-pointer mb-4 text-gray-700 font-medium">  
                                <input  
                                    type="checkbox"  
                                    checked={useTimer}  
                                    onChange={() => setUseTimer(!useTimer)}  
                                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"  
                                />  
                                <span>Usar Timer Regressivo</span>  
                            </label>  

                            {useTimer && (  
                                <motion.div  
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-xl border border-gray-200"  
                                    initial={{ height: 0, opacity: 0 }}  
                                    animate={{ height: "auto", opacity: 1 }}  
                                    transition={{ duration: 0.4, type: "spring" }}  
                                >  
                                    <div className="flex items-center gap-2">  
                                        <input  
                                            type="number"  
                                            min="1"  
                                            value={inputMinutes}  
                                            onChange={(e) => {  
                                                const val = e.target.value;  
                                                setInputMinutes(val === "" ? "" : parseInt(val));  
                                            }}  
                                            className="w-20 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-center font-semibold"  
                                            placeholder="5"  
                                        />  
                                        <span className="text-gray-600 font-medium">minutos</span>  
                                    </div>  
                                    <motion.button  
                                        onClick={resetTimer}  
                                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"  
                                        whileHover={{ scale: 1.05 }}  
                                        whileTap={{ scale: 0.95 }}  
                                    >  
                                        <RefreshCw className="w-4 h-4" /> Atualizar Timer  
                                    </motion.button>  
                                    {timeLeft > 0 && (  
                                        <motion.div  
                                            className="ml-auto flex items-center gap-2 text-sm font-bold"  
                                            initial={{ scale: 0 }}  
                                            animate={{ scale: 1 }}  
                                            transition={{ delay: 0.2 }}  
                                        >  
                                            <Clock className="w-4 h-4 text-yellow-600" /> Tempo Atual: {formatTime(timeLeft)}  
                                        </motion.div>  
                                    )}  
                                </motion.div>  
                            )}  
                        </div>  
                    </motion.div>  

                    {/* Salvar */}  
                    <div className="flex justify-end pt-6 border-t border-gray-200">  
                        <motion.button  
                            onClick={handleSave}  
                            disabled={isSaving}  
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"  
                            whileHover={{ scale: 1.05 }}  
                            whileTap={{ scale: 0.95 }}  
                        >  
                            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}  
                            {isSaving ? "Salvando..." : "Salvar Configurações"}  
                        </motion.button>  
                    </div>  
                </motion.div>  
            </div>  
        </div>  
    );  
};  

export default DashboardNavbarEdit;