import { myExperiences } from "../../../../constants/myExperiences";
import type { Experiences } from "../../../../types/timeline";
import { Timeline } from "../../../common/Timeline";

export default function Experiences() {
  return (
    <div className=" w-full">
      <Timeline data={myExperiences} />
    </div>
  );
}
