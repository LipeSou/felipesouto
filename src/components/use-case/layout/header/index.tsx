import Link from "next/link";

const links = [
  { label: "Tecnologias", href: "#tecnologias", mobile: false },
  { label: "Experiências", href: "#experiencias", mobile: false },
  { label: "Contato", href: "#contato", mobile: true },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-white/85 px-6 py-4 backdrop-blur-md md:px-20 md:py-6">
      <Link
        href="/"
        className="rounded font-secondary text-2xl font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-800 md:text-[28px]"
      >
        <span className="text-gray-800">Felipe</span>
        <span className="text-primary-600">Souto</span>
      </Link>
      <nav aria-label="Seções" className="flex items-center gap-8 text-sm">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`rounded font-medium text-foreground-dark/70 transition-colors hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-800 ${
              link.mobile ? "" : "hidden md:inline"
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
