import React from "react";
import PatientInfo from "./PatientInfo";
import RegisterPatient from "./RegisterPatient";

const AppointmentHome = () => {
  return (
    <>
      <div className="lg:flex justify-center gap-20">
        <div>
          <RegisterPatient />
        </div>
        <div>
          <PatientInfo />
        </div>
      </div>
    </>
  );
};

export default AppointmentHome;
