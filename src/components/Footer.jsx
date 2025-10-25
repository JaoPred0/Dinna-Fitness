import React from "react";
import { FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";

// === Dados do Footer ===
const navLinks = [
    { label: "Início", href: "/" },
    { label: "Produtos", href: "/produtos" },
    { label: "Contato", href: "/contato" },
    { label: "Políticas", href: "/politicas" },
];

const paymentMethods = [
    { src: "/visa.png", alt: "Visa" },
    { src: "/mastercard.png", alt: "Mastercard" },
    { src: "/amex.png", alt: "American Express" },
    { src: "/bradesco.png", alt: "Bradesco" },
    { src: "/elo.png", alt: "Elo" },
    { src: "/hipercard.png", alt: "Hipercard" },
    { src: "/dinheiro.png", alt: "Dinheiro" },
    { src: "/pix.png", alt: "Pix" },
];

const contacts = [
    { icon: <FaPhone />, text: "(67) 9968-9143" },
    { icon: <FaEnvelope />, text: "dinna.fitness.store@gmail.com" },
];

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white relative">

            {/* Conteúdo principal */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Navegação */}
                <div>
                    <h3 className="font-bold mb-4 uppercase">Navegação</h3>
                    <ul className="space-y-2">
                        {navLinks.map((link, i) => (
                            <li key={i}>
                                <a href={link.href} className="hover:text-yellow-300 transition">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pagamento / Envio */}
                <div>
                    <h3 className="font-bold mb-4 uppercase">Meios de Pagamento</h3>
                    <div className="flex flex-wrap gap-3 mb-6 justify-start items-center">
                        {paymentMethods.map((method, i) => (
                            <img
                                key={i}
                                src={method.src}
                                alt={method.alt}
                                className="h-10 md:h-11 transition-transform duration-300 hover:scale-105"
                            />
                        ))}
                    </div>
                </div>

                {/* Contato */}
                <div>
                    <h3 className="font-bold mb-4 uppercase">Contato</h3>
                    <ul className="space-y-2">
                        {contacts.map((contact, i) => (
                            <li key={i} className="flex items-center gap-2">
                                {contact.icon} {contact.text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Rodapé */}
            <div className="border-t border-gray-700 mt-6 py-4 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center px-6">
                {/* Copyright */}
                <span className="text-gray-300">
                    © 2025 Dinna Fitness - (67) 9968-9143. Todos os direitos reservados.
                </span>

                {/* Desenvolvedor */}
                <span className="mt-2 md:mt-0 text-gray-300">
                    Criado pelo programador FullStack{" "}
                    <a
                        href="https://github.com/JaoPred0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 transition-colors underline"
                    >
                        JaooPredo
                    </a>
                </span>
            </div>


            {/* Botão WhatsApp fixo */}
            <a
                href="https://wa.me/556799689143"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-10 right-5 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition z-50"
            >
                <FaWhatsapp className="text-white text-2xl" />
            </a>
        </footer>
    );
};

export default Footer;
