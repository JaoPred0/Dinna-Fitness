import { motion } from "framer-motion";
import { Instagram, Facebook, Send, Youtube, MessageCircle } from "lucide-react";

const SocialLinks = () => {
  const socials = [
    { 
      name: "Instagram", 
      icon: Instagram, 
      link: "https://instagram.com",
      description: "@sualojaonline",
      color: "bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500"
    },
    { 
      name: "Facebook", 
      icon: Facebook, 
      link: "https://facebook.com",
      description: "/sualojaonline",
      color: "bg-blue-600"
    },
    { 
      name: "TikTok", 
      icon: Send, 
      link: "https://tiktok.com",
      description: "@sualojaonline",
      color: "bg-blue-600"
    },
    { 
      name: "YouTube", 
      icon: Youtube, 
      link: "https://youtube.com",
      description: "/sualojaonline",
      color: "bg-red-600"
    },
    { 
      name: "WhatsApp", 
      icon: MessageCircle, 
      link: "https://wa.me/seunumero",
      description: "Fale conosco",
      color: "bg-green-500"
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Conecte-se Conosco
          </motion.h2>
          <motion.p
            className="text-gray-900 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Acompanhe novidades, promoções e lançamentos
          </motion.p>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {socials.map((social, i) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={i}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl text-center flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Ícone com cor da rede */}
                <div className={`w-14 h-14 rounded-full ${social.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Nome + Descrição */}
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {social.name}
                  </h3>
                  <p className="text-xs text-gray-900 mt-1">
                    {social.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;
