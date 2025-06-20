import { myExperiences } from "@/app/constants/myExperiences";
import { Timeline } from "../../../common/time-line";

export default function Experiences() {
  return (
    <div className="w-full bg-background  flex items-center justify-center">
      <div className="w-[90vw]  ">
        <Timeline data={myExperiences} />
      </div>
    </div>
  );
}
