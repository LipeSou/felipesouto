export default function Footer() {
  return (
    <footer className="bg-foreground-dark md:px-20 px-4 mt-44 pt-20 md:pt-28 pb-12   text-white">
      <div className="w-full flex items-center justify-center pb-12 text-center">
        <p className="text-5xl md:text-[120px]">Vamos conversar!</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="md:text-2xl font-light">email</p>
        <p className="text-2xl md:text-[80px]">felipesoutomdt@gmail.com</p>
        <p className="text-sm font-text">Made with ❤️ por Felipe Souto</p>
      </div>
    </footer>
  );
}
