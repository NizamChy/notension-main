import React from "react";
import PatientInfo from "./PatientInfo";
import RegisterPatient from "./RegisterPatient";

const AppointmentHome = () => {
  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row justify-center gap-7 lg:gap-20">
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
