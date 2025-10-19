import { Truck, CreditCard, Lock } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const SoftInfoBar = () => {
  const items = [
    {
      icon: <Truck size={24} className="text-gray-700" />,
      title: "Enviamos para todo Brasil",
      subtitle: "Frete grátis em compras acima de R$450",
    },
    {
      icon: <CreditCard size={24} className="text-gray-700" />,
      title: "Parcelamos em até 5x sem juros",
      subtitle: "Cartões de crédito",
    },
    {
      icon: <Lock size={24} className="text-gray-700" />,
      title: "Compre com segurança",
      subtitle: "Seus dados sempre protegidos",
    },
  ];

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
        {items.map((item, index) => {
          const x = useMotionValue(0);
          const y = useMotionValue(0);

          const handleMouseMove = (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetX = e.clientX - (rect.left + rect.width / 2);
            const offsetY = e.clientY - (rect.top + rect.height / 2);
            x.set(offsetX * 0.15); // efeito de ímã leve
            y.set(offsetY * 0.15);
          };

          const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
          };

          return (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md cursor-pointer "
              style={{ x, y }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.05, boxShadow: "0 15px 25px rgba(0,0,0,0.2)" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{item.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">{item.subtitle}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SoftInfoBar;
