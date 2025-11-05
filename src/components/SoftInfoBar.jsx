import { Truck, CreditCard, Lock } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

const SoftInfoBar = () => {
  const items = [
    {
      icon: <Truck size={24} className="fonte1" />,
      title: "Enviamos para todo o Brasil",
      subtitle: "Frete grátis em compras acima de R$450",
    },
    {
      icon: <CreditCard size={24} className="fonte1" />,
      title: "Parcelamos em até 5x sem juros",
      subtitle: "Cartões de crédito",
    },
    {
      icon: <Lock size={24} className="fonte1" />,
      title: "Compre com segurança",
      subtitle: "Seus dados sempre protegidos",
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
        {items.map((item, index) => {
          const cardRef = useRef(null);
          const x = useMotionValue(0);
          const y = useMotionValue(0);

          const handleMouseMove = (e) => {
            const rect = cardRef.current.getBoundingClientRect();
            const offsetX = e.clientX - (rect.left + rect.width / 2);
            const offsetY = e.clientY - (rect.top + rect.height / 2);
            x.set(offsetX * 0.1);
            y.set(offsetY * 0.1);
          };

          const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
          };

          return (
            <motion.div
              key={index}
              ref={cardRef}
              className="cardInfo flex flex-col items-center text-center backdrop-blur-md rounded-xl p-6 shadow-md cursor-pointer"
              style={{ x, y }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-semibold fonte2 text-sm sm:text-base">
                {item.title}
              </h3>
              <p className="fonte2 text-xs sm:text-sm mt-1">
                {item.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SoftInfoBar;
