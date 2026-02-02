"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { IoInformationOutline } from "react-icons/io5";

import { authenticate } from "@/actions";

export const LoginForm = () => {
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      // Llamamos a la server action
      const result = await authenticate(undefined, formData);

      if (result !== "Success") {
        setError("Correo o contraseña incorrectos");
        return;
      }

      // Redireccionar al home
      window.location.replace("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error en authenticate:", err);
      setError("Ocurrió un error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
        required
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
        required
      />

      {error && (
        <div className="flex flex-row mb-2 items-center text-red-500">
          <IoInformationOutline className="h-5 w-5" />
          <p className="ml-1 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={clsx("btn-primary", { "btn-disabled": isSubmitting })}
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};
