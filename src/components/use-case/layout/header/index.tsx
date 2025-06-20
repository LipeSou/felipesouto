import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-center px-6 lg:px-12 bg-white z-20 w-lvw fixed">
      <nav className="py-8">
        <Link
          href="/"
          className="font-secondary font-heading font-medium text-[32px]  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition"
        >
          <span className="text-gray-800 ">Felipe</span>
          <span className=" text-primary-600 ">Souto</span>
        </Link>
      </nav>
    </header>
  );
}
