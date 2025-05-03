import TechSolarSystem from "../components/useCases/techSolarSystem";

export default function Home() {
  return (
    <div className=" flex items-center justify-between md:px-11">
      {/* <h1 className="font-title">Bem-vindo ao meu portfólio. .</h1> */}
      <div className="hidden md:block w-28">
        <h1 className="font-title px-10">Em construção..</h1>
      </div>
      <div className="w-[100vw] aspect-[4/3] md:w-[70vw] md:aspect-[16/9]">
        <TechSolarSystem />
      </div>
    </div>
  );
}
