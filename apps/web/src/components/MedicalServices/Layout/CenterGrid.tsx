import { MedicalCardGrid } from "./MedicalLayout";
import MedicalCenterCard, { type MedicalCenterCardData } from "../MedicalCenterCard/MedicalCenterCard";

const CenterGrid = ({ centers }: { centers?: MedicalCenterCardData[] | null }) => (
  <MedicalCardGrid className="xl:grid-cols-4">
    {centers?.map((center) => (
      <MedicalCenterCard key={center?._id} center={center} />
    ))}
  </MedicalCardGrid>
);

export default CenterGrid;
