"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { IoInformationOutline } from "react-icons/io5";
import { login, registerUser } from "@/actions";
import { SkeletonWrapper } from "@/components/ui/SkeletonWrapper";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: "onBlur", // Valida cuando el usuario sale del input
  });

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const resp = await registerUser(data.name, data.email, data.password);

      if (!resp.ok) {
        // Aquí capturamos el mensaje del servidor (ej. "Este correo ya está en uso")
        setErrorMessage(resp.message);
        setLoading(false);
        return;
      }

      // Si el registro es exitoso, logueamos automáticamente
      await login(data.email.toLowerCase(), data.password);
      window.location.replace("/");
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor.");
      setLoading(false);
    }
  };

  if (loading) return <SkeletonWrapper type="form" rows={3} />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full fade-in"
    >
      {/* Nombre Completo */}
      <label className="text-sm font-semibold mb-2 text-gray-700">
        Nombre completo
      </label>
      <input
        className={clsx(
          "mb-1 rounded-xl border bg-gray-50 px-5 py-3 outline-none transition-all focus:ring-2",
          errors.name
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-200 focus:ring-(--brand-primary)/20",
        )}
        type="text"
        placeholder="Tu nombre"
        {...register("name", { required: "El nombre es obligatorio" })}
      />
      <span className="text-[10px] text-red-500 h-4 mb-2 ml-2">
        {errors.name?.message}
      </span>

      {/* Correo Electrónico */}
      <label className="text-sm font-semibold mb-2 text-gray-700">
        Correo electrónico
      </label>
      <input
        className={clsx(
          "mb-1 rounded-xl border bg-gray-50 px-5 py-3 outline-none transition-all focus:ring-2",
          errors.email
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-200 focus:ring-(--brand-primary)/20",
        )}
        type="email"
        placeholder="ejemplo@correo.com"
        {...register("email", {
          required: "El correo es obligatorio",
          pattern: { value: /^\S+@\S+$/i, message: "Correo no válido" },
        })}
      />
      <span className="text-[10px] text-red-500 h-4 mb-2 ml-2">
        {errors.email?.message}
      </span>

      {/* Contraseña con validación de Mayúsculas y Números */}
      <label className="text-sm font-semibold mb-2 text-gray-700">
        Contraseña
      </label>
      <input
        className={clsx(
          "mb-1 rounded-xl border bg-gray-50 px-5 py-3 outline-none transition-all focus:ring-2",
          errors.password
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-200 focus:ring-(--brand-primary)/20",
        )}
        type="password"
        placeholder="Mayúsculas, números y min. 6 caracteres"
        {...register("password", {
          required: "La contraseña es obligatoria",
          minLength: { value: 6, message: "Mínimo 6 caracteres" },
          validate: {
            hasUpperCase: (v) =>
              /[A-Z]/.test(v) || "Debe tener al menos una mayúscula",
            hasNumber: (v) => /\d/.test(v) || "Debe tener al menos un número",
          },
        })}
      />
      <span className="text-[10px] text-red-500 h-4 mb-4 ml-2">
        {errors.password?.message}
      </span>

      {/* Alerta de Error del Servidor o Formulario */}
      {(errorMessage || Object.keys(errors).length > 0) && (
        <div className="flex items-center gap-2 mb-4 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-pulse-green">
          <IoInformationOutline size={20} className="shrink-0" />
          <p className="text-xs font-bold leading-tight">
            {errorMessage || "Por favor, completa los campos correctamente."}
          </p>
        </div>
      )}

      {/* Botón de Registro */}
      <button
        type="submit"
        disabled={loading}
        className="bg-(--brand-primary) text-white py-4 px-6 rounded-xl font-bold mt-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/10 disabled:bg-gray-400"
      >
        Crear cuenta
      </button>

      {/* Divisor */}
      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <div className="px-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
          O
        </div>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Link a Login */}
      <Link
        href="/auth/login"
        className="bg-(--brand-black) text-white py-4 px-6 rounded-xl font-bold text-center hover:bg-gray-800 active:scale-[0.98] transition-all"
      >
        Ingresar
      </Link>
    </form>
  );
};
