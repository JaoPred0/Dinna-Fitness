import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Save, X, Edit3, PlusCircle, Trash2, RefreshCw, Link2 } from "lucide-react";
import { db } from "../../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Slider from "react-slick";

const DashboardSite = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [banners, setBanners] = useState([]);
    const [tempBanners, setTempBanners] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Carregar banners do Firestore
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const docRef = doc(db, "config", "site");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().banners) {
                    const loaded = docSnap.data().banners.map((b) =>
                        typeof b === "string" ? { image: b, link: "" } : b
                    );
                    setBanners(loaded);
                }
            } catch (error) {
                console.error("Erro ao carregar banners:", error);
            }
        };
        fetchBanners();
    }, []);


    const handleEditToggle = () => {
        setTempBanners(banners);
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, "config", "site");
            await setDoc(docRef, { banners: tempBanners }, { merge: true });
            setBanners(tempBanners);
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao salvar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddBanner = () => {
        setTempBanners([...tempBanners, { image: "", link: "" }]);
    };


    const handleRemoveBanner = (index) => {
        setTempBanners(tempBanners.filter((_, i) => i !== index));
    };

    const handleUpdateBanner = (index, field, value) => {
        const updated = [...tempBanners];
        updated[index][field] = value;
        setTempBanners(updated);
    };


    // Configurações do React Slick
    const sliderSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true
    };

    return (
        <div className="min-h-screen p-6">
            <motion.h2
                className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-6 flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Edit3 className="w-6 h-6" />
                Gerenciar Banners do Site
            </motion.h2>

            {/* Slider com banners */}
            <div className="mb-8">
                {banners.length > 0 ? (
                    <Slider {...sliderSettings}>
                        {banners.map((banner, i) => (
                            <div key={i} className="rounded-xl overflow-hidden shadow-md border border-gray-200">
                                {banner.link ? (
                                    <a href={banner.link} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={banner.image}
                                            alt={`Banner ${i + 1}`}
                                            className="w-full h-auto object-cover"
                                        />
                                    </a>
                                ) : (
                                    <img
                                        src={banner.image}
                                        alt={`Banner ${i + 1}`}
                                        className="w-full h-auto object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div className="text-gray-500 text-center p-8 border rounded-xl">
                        Nenhum banner definido
                    </div>
                )}
            </div>

            {/* Botão editar */}
            <button
                onClick={handleEditToggle}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
            >
                <Edit3 className="w-4 h-4" /> Editar Banners
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl overflow-y-auto"
                            initial={{ scale: 0.95, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 500 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Image className="w-5 h-5 text-indigo-600" />
                                    Editar Banners
                                </h3>
                                <button
                                    onClick={handleEditToggle}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                {tempBanners.map((banner, i) => (
                                    <div key={i} className="space-y-2">
                                        {/* URL da imagem */}
                                        <input
                                            type="url"
                                            value={banner.image}
                                            onChange={(e) => handleUpdateBanner(i, "image", e.target.value)}
                                            placeholder={`URL da Imagem ${i + 1}`}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />

                                        {/* Link opcional */}
                                        <input
                                            type="url"
                                            value={banner.link}
                                            onChange={(e) => handleUpdateBanner(i, "link", e.target.value)}
                                            placeholder={`URL do Link (opcional)`}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />

                                        {banner.image && (
                                            <img
                                                src={banner.image}
                                                alt={`Preview ${i + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border"
                                            />
                                        )}
                                        <button
                                            onClick={() => handleRemoveBanner(i)}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" /> Remover
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={handleAddBanner}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    <PlusCircle className="w-5 h-5" /> Adicionar novo banner
                                </button>
                            </div>

                            {/* Botões salvar/cancelar */}
                            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                                <button
                                    onClick={handleEditToggle}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? "Salvando..." : "Salvar Tudo"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardSite;
