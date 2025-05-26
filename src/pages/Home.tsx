import SectionOne from "../components/useCases/home/sectionOne";
import Experiences from "../components/useCases/home/experiences";

export default function Home() {
  return (
    <div className="  md:px-11">
      <div className="my-16 md:flex justify-center">
        <SectionOne />
      </div>
      <Experiences />
    </div>
  );
}
