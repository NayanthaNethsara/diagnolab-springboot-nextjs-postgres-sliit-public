"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  ClipboardIcon,
  EditIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

interface Patient {
  id: string;
  patientId: string;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  nic: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  registrationDate: string | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
}

interface LabRecord {
  id: string;
  date: string;
  test: string;
  result: string;
  doctor: string;
}

export default function PatientDetailPage({
  params,
}: {
  params: { patient: string };
}) {
  const patientId = params.patient; // Fix: assuming params.patient is a single string, not an array
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [labRecords, setLabRecords] = useState<LabRecord[]>([]);
  const [, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.access_token) {
      fetch(`${baseUrl}/api/Patient/PatientId/${patientId}`, {
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setPatientDetails(data);
        })
        .catch((error) => {
          console.log(error);
        });

      fetch(`${baseUrl}/api/LabTestRecord/${patientId}`, {
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLabRecords(data);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [session, patientId, baseUrl]);

  const handleEditPatient = () => {
    // Implement edit patient logic here
    console.log("Edit patient");
  };

  const handleDeletePatient = () => {
    // Implement delete patient logic here
    console.log("Delete patient");
  };

  return (
    <div className="flex flex-col mx-auto p-4 space-y-6 ml-56">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 border-2 border-gray-300">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${
                  patientDetails?.firstName +
                  " " +
                  (patientDetails?.lastName || "")
                }&backgroundColor=d1d5db`}
              />
              <AvatarFallback>
                <UserIcon className="w-8 h-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">
                {patientDetails?.name}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Patient ID: {patientDetails?.patientId}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleEditPatient}>
              <EditIcon className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeletePatient}
              className="text-red-600 hover:text-red-700"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoGroup>
                  <InfoItem
                    icon={<UserIcon />}
                    label="First Name"
                    value={patientDetails?.firstName}
                  />
                  <InfoItem
                    icon={<UserIcon />}
                    label="Last Name"
                    value={patientDetails?.lastName}
                  />
                  <InfoItem
                    icon={<CalendarIcon />}
                    label="Date of Birth"
                    value={patientDetails?.dateOfBirth}
                  />
                  <InfoItem
                    icon={<CalendarIcon />}
                    label="Age"
                    value={patientDetails?.age?.toString()}
                  />
                  <InfoItem
                    icon={<ClipboardIcon />}
                    label="National ID"
                    value={patientDetails?.nic}
                  />
                  <InfoItem
                    icon={<PhoneIcon />}
                    label="Phone Number"
                    value={patientDetails?.phoneNumber}
                  />
                  <InfoItem
                    icon={<MailIcon />}
                    label="Email"
                    value={patientDetails?.email}
                  />
                </InfoGroup>
                <InfoGroup>
                  <InfoItem
                    icon={<MapPinIcon />}
                    label="Address"
                    value={patientDetails?.address}
                  />
                  <InfoItem
                    icon={<MapPinIcon />}
                    label="City"
                    value={patientDetails?.city}
                  />
                  <InfoItem
                    icon={<MapPinIcon />}
                    label="Zip Code"
                    value={patientDetails?.zipCode}
                  />
                  <InfoItem
                    icon={<CalendarIcon />}
                    label="Registration Date"
                    value={patientDetails?.registrationDate || "N/A"}
                  />
                  <InfoItem
                    icon={<UserIcon />}
                    label="Emergency Contact"
                    value={patientDetails?.emergencyContactName}
                  />
                  <InfoItem
                    icon={<PhoneIcon />}
                    label="Emergency Phone"
                    value={patientDetails?.emergencyContactPhone}
                  />
                </InfoGroup>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-600">
                {patientDetails?.notes || "No notes available."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Laboratory Test Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.test}</TableCell>
                  <TableCell>{record.result}</TableCell>
                  <TableCell>{record.doctor}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-gray-400">{icon}</div>
      <p className="text-sm">
        <span className="font-semibold text-gray-700">{label}:</span>{" "}
        <span className="text-gray-600">{value || "N/A"}</span>
      </p>
    </div>
  );
}
