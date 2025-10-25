import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  User,
  Phone,
  Mail,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCart();
  const [config, setConfig] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const accountRef = useRef(null);
  const logoRef = useRef(null);
  const navLinksRef = useRef(null);
  const mobileMenuRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // some se passar de 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { y: -50, opacity: 0, rotation: -10 },
      { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
    );

    gsap.fromTo(
      navLinksRef.current?.children || [],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );

    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) setIsAccountOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const loadConfig = async () => {
      const snap = await getDoc(doc(db, "config", "site"));
      if (snap.exists() && snap.data().bannerConfig) {
        const cfg = snap.data().bannerConfig;
        setConfig(cfg);
        setTimeLeft(cfg.timeLeft ?? 0);
      }
    };

    // Tenta primeiro localStorage para pré-visualização rápida
    const local = localStorage.getItem("bannerConfig");
    if (local) {
      const cfg = JSON.parse(local);
      setConfig(cfg);
      setTimeLeft(cfg.timeLeft ?? 0);
    } else {
      loadConfig();
    }
  }, []);

  // Contador regressivo opcional
  useEffect(() => {
    if (!config || !config.isVisible || !config.useTimer || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [config, timeLeft]);

  // Formata segundos para mm:ss
  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (!config || !config.isVisible) return null;


  const toggleAccountMenu = () => setIsAccountOpen(!isAccountOpen);
  const handleSignOut = async () => await signOut(auth);

  const navLinks = [
    { label: "Início", href: "/" },
    { label: "Produtos", href: "/produtos" },
    { label: "Contato", href: "/contato" },
    { label: "Políticas", href: "/politicas" },
  ];

  const accountMenuItems = user
    ? [
      { icon: Settings, label: "Meu Perfil", href: "/perfil" },
      { icon: LogOut, label: "Sair", action: handleSignOut },
    ]
    : [
      { icon: LogIn, label: "Entrar", href: "/login" },
      { icon: UserPlus, label: "Cadastre-se", href: "/cadastro" },
    ];

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-black/90 to-gray-900/95 text-white shadow-md z-[9999]">
      <AnimatePresence>
        <motion.div
          className="w-full text-center text-sm font-bold py-2.5 shadow-md border-b border-white/20 z-[500]"
          style={{
            backgroundColor: config.bgColor || "#047857",
            color: config.textColor || "#ffffff",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          {config.bannerText || "Digite algo..."}{" "}
          {config.useTimer && timeLeft > 0 && (
            <span className="ml-2 opacity-80">
              <Clock className="inline w-4 h-4 mr-1" />
              {formatTime(timeLeft)}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Barra de contato */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            className="hidden sm:flex items-center justify-between px-6 py-2.5 text-xs bg-black/40 backdrop-blur-md border-b border-white/10 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }} // sobe mais ao desaparecer
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-6">
              <a href="tel:+556799689143" className="flex items-center gap-2 hover:text-yellow-300 transition">
                <Phone size={14} className="text-emerald-400" /> (67) 9968-9143
              </a>
              <a href="mailto:contato@dinnafitness.com" className="flex items-center gap-2 hover:text-yellow-300 transition">
                <Mail size={14} className="text-blue-400" /> dinna.fitness.store@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-4 text-yellow-300 font-semibold">
              {user ? (
                <span>Bem-vindo(a), {user.displayName || user.email.split("@")[0]} 👋</span>
              ) : (
                <>
                  <a href="/cadastro" className="hover:text-yellow-100 transition">Cadastre-se</a> |{" "}
                  <a href="/login" className="hover:text-yellow-100 transition">Entrar</a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}

      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto relative">
        <Link to="/" className="text-xl sm:text-2xl font-black cursor-pointer select-none">
          <span className="text-yellow-400">Dinna</span> <span>Fitness</span>
        </Link>

        <ul ref={navLinksRef} className="hidden lg:flex gap-8 font-semibold text-sm sm:text-base">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-yellow-300 transition">{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Carrinho */}
          <div className="relative cursor-pointer group">
            <Link to="/carrinho" className="relative cursor-pointer group">
              <ShoppingCart className="w-5 h-5 text-yellow-300" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>

          {/* Conta */}
          <div ref={accountRef} className="relative">
            <button onClick={toggleAccountMenu} className="flex items-center gap-1 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
              <User className="w-5 h-5 text-gray-300" />
              <ChevronDown className={`w-4 h-4 transition-transform ${isAccountOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isAccountOpen && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-56 bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  <div className="py-2">
                    {accountMenuItems.map((item) => {
                      const Icon = item.icon;
                      return item.action ? (
                        <button key={item.label} onClick={item.action} className="flex items-center gap-2 px-4 py-2 w-full text-left text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-300 transition">
                          <Icon className="w-4 h-4" /> {item.label}
                        </button>
                      ) : (
                        <a key={item.label} href={item.href} className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-300 transition">
                          <Icon className="w-4 h-4" /> {item.label}
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botão Mobile */}
          <button className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="lg:hidden fixed inset-0 bg-black/90 flex flex-col items-center justify-center space-y-8 px-6 py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}  // sem x ou translate
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}       // apenas fade/scale suave
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X size={28} className="text-white" />
            </button>

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-2xl font-bold text-yellow-300 hover:text-orange-400 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="flex flex-col items-center gap-4 pt-8 border-t border-white/20">
              {user ? (
                <span className="text-xl text-yellow-300 font-semibold">
                  Bem-vindo, {user.displayName || user.email.split("@")[0]} 👋
                </span>
              ) : (
                <>
                  <a
                    href="/login"
                    className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400"
                  >
                    Entrar
                  </a>
                  <a
                    href="/cadastro"
                    className="px-6 py-3 border-2 border-yellow-500 text-yellow-300 font-bold rounded-xl hover:bg-yellow-500 hover:text-black"
                  >
                    Cadastre-se
                  </a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
