import React, { useState } from "react";
import * as emailjs from "@emailjs/browser";


const Contato = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!formData.nome || !formData.email || !formData.mensagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <div className="rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 title text-center">
          Contato
        </h2>

        {submitted && (
          <p className="mb-4 font3 font-semibold text-center">
            Mensagem enviada com sucesso!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium fonte2">
              Nome *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium fonte2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium fonte2">
              Assunto
            </label>
            <input
              type="text"
              name="assunto"
              value={formData.assunto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium fonte2">
              Mensagem *
            </label>
            <textarea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              rows="5"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 "
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold transition card2 text-white`}
          >
            {loading ? "Enviando..." : "Enviar Mensagem"}
          </button>
        </form>

        <div className="mt-6 text-center fonte1">
          <p>Ou entre em contato pelo email: dinna.fitness.store@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Contato;
