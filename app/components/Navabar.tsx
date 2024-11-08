// components/Navbar.tsx
import { Link } from "@remix-run/react";
import { useState } from "react";
import LogoutButton from "./auth/cerar-sesion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Administrador
          </span>
        </Link>

        {/* Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Navigation Menu */}
        <div
          className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink to="/administrador" label="Gestión de Usuarios" />
            </li>
            <li>
              <NavLink to="/clientes" label="Gestión de Clientes" />
            </li>
            <li>
              <NavLink to="/mostrar" label="Gestión de Inmuebles" />
            </li>
            <li>
              <NavLink to="/reportes" label="Gestión de Reportes" />
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <div className="hidden md:block">
          <LogoutButton />
        </div>
      </div>

      {/* Logout Button for Mobile */}
      {isMenuOpen && (
        <div className="block md:hidden mt-4 px-4">
          <LogoutButton />
        </div>
      )}
    </nav>
  );
}

// NavLink Component for Navbar Links with Tailwind Styles
function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="block py-2 px-3 text-blue-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent"
    >
      {label}
    </Link>
  );
}
