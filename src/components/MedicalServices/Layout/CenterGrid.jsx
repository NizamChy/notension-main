import { MedicalCardGrid } from "./MedicalLayout";
import MedicalCenterCard from "../MedicalCenterCard/MedicalCenterCard";

const CenterGrid = ({ centers }) => (
  <MedicalCardGrid className="xl:grid-cols-4">
    {centers?.map((center) => (
      <MedicalCenterCard key={center?._id} center={center} />
    ))}
  </MedicalCardGrid>
);

export default CenterGrid;
