import { myExperiences } from "@/app/constants/myExperiences";
import { Timeline } from "../../../common/time-line";

export default function Experiences() {
  return (
    <div
      id="experiencias"
      className="flex w-full scroll-mt-16 items-center justify-center bg-background"
    >
      <div className="w-[90vw]  ">
        <Timeline data={myExperiences} />
      </div>
    </div>
  );
}
