"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut as signOutClient } from "next-auth/react"; // Importante: Versión cliente
import { useRouter } from "next/navigation";
import clsx from "clsx";

import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

import { useUIStore, useCartStore } from "@/store";
import { SkeletonWrapper } from "@/components/ui/SkeletonWrapper";

export const Sidebar = () => {
  const router = useRouter();
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const clearCart = useCartStore((state) => state.clearCart);

  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";
  const isLoading = status === "loading" || isLoggingOut;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Limpiamos estados locales
    clearCart();
    localStorage.removeItem("shopping-cart");

    // Usamos el signOut de cliente con redirect: false para evitar el reload
    // Esto actualiza el estado de useSession instantáneamente
    await signOutClient({ redirect: false });

    setIsLoggingOut(false);
    closeMenu();
    router.replace("/auth/login");
  };

  return (
    <div className="relative">
      {/* Overlay */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500" />
      )}

      {/* Main Sidebar Container */}
      <nav
        className={clsx(
          "fixed right-0 top-0 h-screen z-50 transition-all duration-500 transform shadow-2xl overflow-y-auto",
          "w-full sm:w-96 bg-white/95 backdrop-blur-2xl border-l border-white/20",
          isSideMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-end p-6 mb-4 border-b border-gray-100">
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-all active:scale-90"
          >
            <IoCloseOutline size={30} />
          </button>
        </div>

        <div className="px-4 space-y-2">
          {isLoading ? (
            <SkeletonWrapper type="sidebar" rows={5} />
          ) : (
            <>
              {/* Sección Usuario - BRAND BLACK */}
              {isAuthenticated && (
                <div className="bg-(--brand-black) p-2 rounded-2xl mb-6 shadow-xl overflow-hidden">
                  <SidebarItem
                    href="/profile"
                    icon={<IoPersonOutline size={22} />}
                    label="Perfil"
                    onClick={closeMenu}
                    dark
                  />
                  <SidebarItem
                    href="/orders"
                    icon={<IoTicketOutline size={22} />}
                    label="Mis Órdenes"
                    onClick={closeMenu}
                    dark
                  />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-4 rounded-xl text-red-400 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <IoLogOutOutline
                      size={22}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    <span className="ml-4 font-bold text-sm tracking-tight">
                      Cerrar Sesión
                    </span>
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <SidebarItem
                  href="/auth/login"
                  icon={<IoLogInOutline size={22} />}
                  label="Ingresar / Registrarse"
                  onClick={closeMenu}
                  primary
                />
              )}

              {/* Sección Admin - BRAND BLACK */}
              {isAdmin && (
                <div className="mt-8 bg-(--brand-black) p-2 rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 mb-1 border-b border-white/5">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">
                      Panel Administración
                    </p>
                  </div>
                  <SidebarItem
                    href="/admin/products"
                    icon={<IoShirtOutline size={22} />}
                    label="Gestión Productos"
                    onClick={closeMenu}
                    dark
                  />
                  <SidebarItem
                    href="/admin/orders"
                    icon={<IoTicketOutline size={22} />}
                    label="Gestión Órdenes"
                    onClick={closeMenu}
                    dark
                  />
                  <SidebarItem
                    href="/admin/users"
                    icon={<IoPeopleOutline size={22} />}
                    label="Gestión Usuarios"
                    onClick={closeMenu}
                    dark
                  />
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

/* Sub-componente optimizado */
interface ItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
  dark?: boolean;
}

const SidebarItem = ({
  href,
  icon,
  label,
  onClick,
  primary,
  dark,
}: ItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center p-4 rounded-xl transition-all duration-300 group mb-1",
        {
          "bg-(--brand-primary) text-white hover:brightness-110 shadow-lg":
            primary,
          "text-white/70 hover:bg-white/10 hover:text-white": dark,
          "text-gray-600 hover:bg-gray-50 hover:text-(--brand-primary)":
            !primary && !dark,
        },
      )}
    >
      <span className="group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
        {icon}
      </span>
      <span className="ml-4 font-bold text-sm sm:text-base tracking-tight">
        {label}
      </span>
    </Link>
  );
};
