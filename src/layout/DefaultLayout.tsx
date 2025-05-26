import { Command } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-theme text-theme flex flex-col">
      <header className="p-8 flex items-center justify-between">
        <nav>
          <Link to="/" className="font-theme text-xl md:text-2xl! font-bold!">
            Felipe Souto
          </Link>
        </nav>
        <div className="hidden md:block">
          <div className="cursor-pointer flex items-center ">
            <span className="text-base mr-2">Navegue para...</span>
            <div className="flex items-center justify-items-center border-[1px] border-solid fs-border px-1">
              <Command height={16} />K
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="p-4 pt-80 text-center text-sm font-text">
        <p>© {new Date().getFullYear()} Felipe Souto</p>
      </footer>
    </div>
  );
}
