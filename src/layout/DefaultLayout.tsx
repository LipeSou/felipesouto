import { Link, Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-theme text-theme flex flex-col">
      <header className="p-8 flex items-center justify-between">
        <nav>
          <Link
            to="/"
            className="font-title font-theme text-xl md:text-2xl! font-bold!"
          >
            Felipe Souto
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="p-4 pt-[1000px] text-center text-sm font-text">
        <p>© {new Date().getFullYear()} Felipe Souto</p>
      </footer>
    </div>
  );
}
