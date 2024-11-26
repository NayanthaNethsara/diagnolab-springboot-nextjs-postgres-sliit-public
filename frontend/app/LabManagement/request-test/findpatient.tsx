"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PatientSummary } from "./page";

interface FindPatientProps {
  selectedPatient: PatientSummary | undefined;
  setSelectedPatient: React.Dispatch<
    React.SetStateAction<PatientSummary | undefined>
  >;
}

export default function FindPatient({
  selectedPatient,
  setSelectedPatient,
}: FindPatientProps) {
  const [searchType, setSearchType] = useState("Name");
  const [searchTerm, setSearchTerm] = useState("");
  const [] = useState(false);
  const [patientData, setPatientData] = useState<PatientSummary[]>([]);
  const [searchResults, setSearchResults] = useState<PatientSummary[]>([]);
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (session?.user?.access_token) {
      fetch(`${baseUrl}/api/Patient/SearchCard/all`, {
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setPatientData(data))
        .catch((error) => console.error("Error fetching Patient data:", error));
    }
  }, [session, baseUrl]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      let filteredResults: PatientSummary[] = [];
      if (searchType === "Name") {
        filteredResults = patientData.filter((patient) =>
          `${patient.firstName} ${patient.lastName}`
            .toLowerCase()
            .startsWith(value.toLowerCase())
        );
      } else if (searchType === "NIC") {
        filteredResults = patientData.filter((patient) =>
          patient.nic?.toLowerCase().startsWith(value.toLowerCase())
        );
      } else if (searchType === "ID") {
        filteredResults = patientData.filter((patient) =>
          patient.patientId
            .toString()
            .toLowerCase()
            .startsWith(value.toLowerCase())
        );
      }
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const onSelectPatient = (patient: PatientSummary) => {
    setSelectedPatient(patient);
    setSearchTerm("");
    setSearchResults([]);
  };

  const clearSelectedPatient = () => {
    setSelectedPatient(undefined);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Find Patient</CardTitle>
        <CardDescription>
          Enter the patient&apos;s details below to search for their records,
          add a new bill, or manage an existing patient.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!selectedPatient ? (
            <>
              <Tabs defaultValue="Name" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="Name"
                    onClick={() => setSearchType("Name")}
                  >
                    Name
                  </TabsTrigger>
                  <TabsTrigger value="NIC" onClick={() => setSearchType("NIC")}>
                    NIC
                  </TabsTrigger>
                  <TabsTrigger value="ID" onClick={() => setSearchType("ID")}>
                    Patient ID
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder={`Search patients by ${searchType.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="flex-grow"
                />
                <Button size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : null}
          {selectedPatient ? (
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  Selected Patient
                </Badge>
                <span className="text-sm font-medium">
                  PatientID:&nbsp;
                  {`${selectedPatient.patientId}`}
                  &nbsp;|&nbsp; Name:&nbsp;
                  {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                  &nbsp;|&nbsp; DOB:&nbsp;
                  {`${selectedPatient.dateOfBirth}`}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearSelectedPatient}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <ScrollArea className={"h-max-[200px] w-full "}>
              {searchTerm.length > 0 ? (
                searchResults.length > 0 ? (
                  searchResults.map((patient) => (
                    <div
                      key={patient.patientId}
                      onClick={() => onSelectPatient(patient)}
                      className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{`${patient.firstName} ${patient.lastName}`}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {patient.patientId}
                        </p>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-xs text-muted-foreground">
                          DOB: {patient.dateOfBirth}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          NIC: {patient.nic}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        Select
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground p-2 text-sm">
                    No patients found
                  </p>
                )
              ) : (
                <p className="text-center text-muted-foreground p-2 text-sm">
                  Enter a search term to find patients
                </p>
              )}
            </ScrollArea>
          )}

          <div className="flex justify-between items-center pt-4">
            <Button
              variant={"default"}
              onClick={() =>
                (window.location.href = "/LabManagement/add-patient")
              }
            >
              Add New Patient
            </Button>
            <Button variant="secondary" disabled={!selectedPatient}>
              View Patient Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
