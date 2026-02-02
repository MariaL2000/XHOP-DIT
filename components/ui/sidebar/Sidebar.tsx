"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
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
import { logout as logoutAction } from "@/actions";

export const Sidebar = () => {
  const router = useRouter();
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const clearCart = useCartStore((state) => state.clearCart);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  const handleLogout = async () => {
    clearCart();
    localStorage.removeItem("shopping-cart");
    await logoutAction();
    closeMenu();
    router.push(isAdmin ? "/admin" : "/auth/new-account");
  };

  return (
    <div className="relative">
      {/* Background Black Overlay con Blur */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500" />
      )}

      {/* Click Outside Listener */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-40 cursor-pointer"
        />
      )}

      {/* Main Sidebar Container */}
      <nav
        className={clsx(
          "fixed right-0 top-0 h-screen z-50 transition-all duration-500 transform shadow-2xl overflow-y-auto",
          "w-full sm:w-96 bg-white/90 backdrop-blur-2xl border-l border-white/20",
          {
            "translate-x-0": isSideMenuOpen,
            "translate-x-full": !isSideMenuOpen,
          },
        )}
      >
        {/* Header de la Sidebar - SOLO ICONO */}
        <div className="flex items-center justify-end p-6 mb-4 border-b border-gray-100">
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-all duration-300 active:scale-90"
          >
            <IoCloseOutline size={30} />
          </button>
        </div>

        {/* Opciones del Menú */}
        <div className="px-4 space-y-2">
          {isAuthenticated && (
            <>
              <SidebarItem
                href="/profile"
                icon={<IoPersonOutline size={22} />}
                label="Perfil"
                onClick={closeMenu}
              />
              <SidebarItem
                href="/orders"
                icon={<IoTicketOutline size={22} />}
                label="Mis Órdenes"
                onClick={closeMenu}
              />
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-4 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
              >
                <IoLogOutOutline
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
                <span className="ml-4 font-bold text-sm">Cerrar Sesión</span>
              </button>
            </>
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

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="my-8 mx-6 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
              <p className="px-4 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                Panel Administración
              </p>

              <SidebarItem
                href="/admin/products"
                icon={<IoShirtOutline size={22} />}
                label="Gestión Productos"
                onClick={closeMenu}
              />
              <SidebarItem
                href="/admin/orders"
                icon={<IoTicketOutline size={22} />}
                label="Gestión Órdenes"
                onClick={closeMenu}
              />
              <SidebarItem
                href="/admin/users"
                icon={<IoPeopleOutline size={22} />}
                label="Gestión Usuarios"
                onClick={closeMenu}
              />
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

/* Sub-componente para ítems de la Sidebar */
interface ItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

const SidebarItem = ({ href, icon, label, onClick, primary }: ItemProps) => {
  // Estilo dinámico para el item primario (Login)
  const primaryStyle = primary
    ? {
        backgroundColor: "var(--brand-primary)",
        boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.2)",
      }
    : {};

  return (
    <Link
      href={href}
      onClick={onClick}
      style={primaryStyle}
      className={clsx(
        "flex items-center p-4 rounded-xl transition-all duration-300 group",
        primary
          ? "text-white hover:brightness-110 shadow-lg"
          : "text-gray-600 hover:bg-gray-50 hover:text-(--brand-primary)",
      )}
    >
      <span className="group-hover:scale-110 group-hover:rotate-3 transition-transform">
        {icon}
      </span>
      <span className="ml-4 font-bold text-sm sm:text-base tracking-tight">
        {label}
      </span>
    </Link>
  );
};
