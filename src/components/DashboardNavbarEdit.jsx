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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <motion.h2
                    className="text-3xl font-bold text-green-700 flex items-center gap-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Edit3 className="w-6 h-6" /> Configurar Banner Superior
                </motion.h2>

                <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
            </div>

            {/* Preview */}
            {isVisible && (
                <motion.div
                    className="text-center text-sm py-3 font-bold rounded-lg shadow-md mb-6"
                    style={{ backgroundColor: bgColor, color: textColor }}
                >
                    {bannerText || "Digite algo..."}{" "}
                    {useTimer && <span className="ml-2 opacity-80">{formatTime(timeLeft)}</span>}
                </motion.div>
            )}

            {/* Configurações */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-2xl mx-auto space-y-5">
                {/* Texto */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">Texto do Banner (opcional)</label>
                    <textarea
                        value={bannerText}
                        onChange={(e) => setBannerText(e.target.value)}
                        rows={3}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Cores */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Cor de Fundo (opcional)</label>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Cor do Texto (opcional)</label>
                        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                    </div>
                </div>

                {/* Visibilidade e Timer */}
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={useTimer} onChange={() => setUseTimer(!useTimer)} className="form-checkbox" />
                        Usar Timer
                    </label>

                    {useTimer && (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                value={inputMinutes}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setInputMinutes(val === "" ? "" : parseInt(val));
                                }}
                                className="w-20 p-2 border rounded"
                            />
                            <span>minutos</span>
                            <button
                                onClick={() => setTimeLeft(inputMinutes * 60)} // atualiza o timer
                                className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg"
                            >
                                Atualizar
                            </button>
                        </div>
                    )}
                </div>

                {/* Salvar */}
                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                        {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? "Salvando..." : "Salvar Configurações"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbarEdit;
