import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import {
  IoShieldCheckmarkOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 mb-20">
      <Title title="Perfil" subtitle="Datos de sesión" className="mb-8" />

      <div className="bg-white border border-gray-100 rounded-4xl shadow-sm overflow-hidden">
        {/* Header de la tarjeta */}
        <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IoShieldCheckmarkOutline
              className="text-(--brand-black)"
              size={20}
            />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-(--brand-black)">
              Estado de Usuario
            </h3>
          </div>
          <span className="px-4 py-1 rounded-full bg-(--brand-black) text-white text-[10px] font-black uppercase tracking-widest">
            {session.user.role}
          </span>
        </div>

        {/* Contenido principal */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4 text-gray-400">
            <IoInformationCircleOutline size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Metadata del Sistema
            </span>
          </div>

          {/* Bloque de datos JSON modernizado */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-gray-100 to-gray-50 rounded-2xl blur opacity-25"></div>
            <pre className="relative bg-gray-50 p-6 rounded-2xl text-xs sm:text-sm font-mono text-gray-600 overflow-x-auto no-scrollbar border border-gray-100 leading-relaxed">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>

          {/* Rol destacado abajo como tenías antes */}
          <div className="mt-10 pt-8 border-t border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Rol Asignado
            </p>
            <h3 className="text-4xl font-black text-(--brand-black) tracking-tighter uppercase">
              {session.user.role}
            </h3>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
        ID de sesión activa: {session.user.id}
      </p>
    </div>
  );
}
