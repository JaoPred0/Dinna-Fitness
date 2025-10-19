import React, { useState } from "react";

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação simples
    if (!formData.nome || !formData.email || !formData.mensagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    // Aqui você pode integrar com Firebase, EmailJS, ou API de envio
    console.log("Mensagem enviada:", formData);

    setSubmitted(true);
    setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
          Contato
        </h2>

        {submitted && (
          <p className="mb-4 text-green-600 font-semibold text-center">
            Mensagem enviada com sucesso!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Nome *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Assunto
            </label>
            <input
              type="text"
              name="assunto"
              value={formData.assunto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Mensagem *
            </label>
            <textarea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              rows="5"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-500 transition"
          >
            Enviar Mensagem
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500">
          <p>Ou entre em contato pelo email: dinna.fitness.store@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Contato;
