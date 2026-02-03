"use client";

import { useState } from "react";
import Link from "next/link";
import { IoInformationOutline } from "react-icons/io5";
import { authenticate } from "@/actions";
import { SkeletonWrapper } from "@/components/ui/SkeletonWrapper";

export const LoginForm = () => {
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await authenticate(undefined, formData);
      if (result !== "Success") {
        setError("Credenciales incorrectas");
        setIsSubmitting(false);
        return;
      }
      window.location.replace("/");
    } catch (err) {
      setError("Error al iniciar sesión");
      setIsSubmitting(false);
    }
  };

  // El skeleton ahora hereda el ancho del contenedor padre
  if (isSubmitting) return <SkeletonWrapper type="form" rows={2} />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <label
        className="mb-2 text-sm font-semibold text-gray-700"
        htmlFor="email"
      >
        Correo electrónico
      </label>
      <input
        className="px-5 py-3 border border-gray-200 bg-gray-50 focus:bg-white rounded-xl mb-5 outline-none transition-all focus:ring-2 focus:ring-(--brand-primary)/20"
        type="email"
        name="email"
        placeholder="tu@correo.com"
        required
      />

      <label
        className="mb-2 text-sm font-semibold text-gray-700"
        htmlFor="password"
      >
        Contraseña
      </label>
      <input
        className="px-5 py-3 border border-gray-200 bg-gray-50 focus:bg-white rounded-xl mb-5 outline-none transition-all focus:ring-2 focus:ring-(--brand-primary)/20"
        type="password"
        name="password"
        placeholder="******"
        required
      />

      {error && (
        <div className="flex items-center gap-2 mb-6 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-fade-in">
          <IoInformationOutline size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-(--brand-primary) text-white py-4 px-6 rounded-xl font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:bg-gray-400 shadow-lg shadow-blue-500/20"
      >
        Ingresar
      </button>

      <div className="flex items-center my-8">
        <div className="flex-1 border-t border-gray-200"></div>
        <div className="px-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
          O
        </div>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <Link
        href="/auth/new-account"
        className="bg-(--brand-black) text-white py-4 px-6 rounded-xl font-bold text-center transition-all hover:bg-gray-800 active:scale-[0.98]"
      >
        Crear una nueva cuenta
      </Link>
    </form>
  );
};
