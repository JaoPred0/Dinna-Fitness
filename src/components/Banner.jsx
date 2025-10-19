import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { db } from "./../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Banner de 3780x1890 recomendado
const BannerCarousel = () => {
    const [banners, setBanners] = useState([]);

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

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
    };

    if (banners.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                Carregando Banners
            </div>
        );
    }

    return (
        <div className="w-full cursor-grab hover:cursor-grab active:cursor-grabbing">
            <Slider {...settings}>
                {banners.map((banner, index) => (
                    <div
                        key={index}
                        className="overflow-hidden shadow-md"
                        style={{ maxHeight: "500px" }} // altura máxima opcional
                    >
                        {banner.link ? (
                            <a href={banner.link} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={banner.image}
                                    alt={`Banner ${index + 1}`}
                                    className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
                                />
                            </a>
                        ) : (
                            <img
                                src={banner.image}
                                alt={`Banner ${index + 1}`}
                                className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
                            />
                        )}
                    </div>
                ))}
            </Slider>
        </div>

    );
};

export default BannerCarousel;
