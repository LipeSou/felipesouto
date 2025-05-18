import SectionOne from "../components/useCases/home/sectionOne";
import SectionTwo from "../components/useCases/home/sectionTwo";

export default function Home() {
  return (
    <div className="  md:px-11">
      <div className="my-16">
        <SectionOne />
      </div>
      <SectionTwo />
    </div>
  );
}
