"use client";
import { LabTestBill } from "./billing";
import FindPatient from "./findpatient";
import RequestTests from "./requesttest";
import { useState } from "react";
import { SelectedTest } from "./requesttest";

export interface PatientSummary {
  id: number;
  patientId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  nic: string;
}

export default function Dashboard() {
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary>();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 grid-cols-10">
      <div className="col-span-6 space-y-4">
        <FindPatient
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />
        <RequestTests
          selectedTests={selectedTests}
          setSelectedTests={setSelectedTests}
        />
      </div>
      <div className="col-span-4">
        <LabTestBill
          selectedTests={selectedTests}
          selectedPatient={selectedPatient}
        />
      </div>
    </main>
  );
}
