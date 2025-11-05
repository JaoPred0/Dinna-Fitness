import { motion } from "framer-motion";

const NewsletterForm = () => {
  return (
    <motion.div
      className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-2xl p-8 text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold title mb-2">
        Inscreva-se
      </h2>
      <p className="fonte2 mb-6">
        Receba as últimas novidades diretamente no seu e-mail.
      </p>

      <form className="flex flex-col gap-4">
        {/* Nome */}
        <input
          type="text"
          placeholder="Nome Completo"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 
          focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Seu E-mail"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 
          focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
        />

        {/* Botão */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full px-4 py-3 rounded-xl topbar fonte2 font-semibold shadow-md  transition-all"
        >
          Inscreva-se
        </motion.button>
      </form>
    </motion.div>
  );
};

export default NewsletterForm;
