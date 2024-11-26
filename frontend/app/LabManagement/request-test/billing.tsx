"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Copy, MoreVertical, Printer } from "lucide-react";
import { SelectedTest } from "./requesttest";
import { useSession } from "next-auth/react";
import { PatientSummary } from "./page";
import { readNameFromJwt } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface LabTestProps {
  selectedTests: SelectedTest[];
  selectedPatient: PatientSummary | undefined;
}

export function LabTestBill({ selectedTests, selectedPatient }: LabTestProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const user = readNameFromJwt(session?.user.access_token || "");
  // Lab fee and tax
  const labFee = 25;
  const taxRate = 0.1; // 10%

  // Calculate subtotal
  const subtotal = selectedTests.reduce((sum, test) => sum + test.price, 0);

  // Calculate tax
  const tax = subtotal * taxRate;

  // Calculate total
  const total = subtotal + labFee + tax;

  const handleConfirmPayment = () => {
    if (!selectedTests || selectedTests.length === 0) {
      toast({
        title: "Error",
        description:
          "No tests selected. Please select tests to calculate the bill.",
      });
      return;
    }

    if (!selectedPatient) {
      toast({
        title: "Error",
        description:
          "No tests selected. Please select tests to calculate the bill.",
      });
      return;
    }

    if (!total || total <= 0) {
      toast({
        title: "Error",
        description:
          "No tests selected. Please select tests to calculate the bill.",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description:
          "No tests selected. Please select tests to calculate the bill.",
      });
      return;
    }

    fetch(`${baseUrl}/api/bills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.access_token}`,
      },
      body: JSON.stringify({
        patientId: selectedPatient.patientId,
        labTestIds: selectedTests.map((test) => test.id),
        amount: total,
        billedBy: user,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        toast({
          title: "Completed",
          description: `Reference Number: ${data.referenceNumber}.  Amount: ${data.amount} LKR.`,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `There was a problem with the fetch operation: ${error.message}`,
        });
      });
  };

  const handleRequestReport = () => {
    console.log("Report requested");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Lab Test Bill LT2023112
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Bill ID</span>
            </Button>
          </CardTitle>
          <CardDescription>Date: November 23, 2023</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Printer className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Print Bill
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Patient Information</div>
          {selectedPatient ? (
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Patient ID</dt>
                <dd>{selectedPatient.patientId}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Patient Name</dt>
                <dd>
                  {selectedPatient.firstName + " " + selectedPatient.lastName}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Gender</dt>
                <dd>{selectedPatient.gender}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Date of Birth</dt>
                <dd>{selectedPatient.dateOfBirth}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{selectedPatient.phoneNumber}</dd>
              </div>
            </dl>
          ) : (
            <div className="text-muted-foreground">
              Select or add a new patient to generate a bill.
            </div>
          )}
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Test Details</div>
          <ul className="grid gap-3">
            {selectedTests.length > 0 ? (
              selectedTests.map((test) => (
                <li key={test.id} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{test.name}</span>
                  <span>{test.price} LKR</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">
                No tests selected. Please select tests to calculate the bill.
              </li>
            )}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{subtotal.toFixed(2)} LKR</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Lab Fee</span>
              <span>{labFee.toFixed(2)} LKR</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span>{tax.toFixed(2)} LKR</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>{total.toFixed(2)} LKR</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center border-t bg-muted/50 px-6 py-4 space-y-3">
        {" "}
        <div className="flex space-x-4 w-full">
          <Button onClick={handleConfirmPayment} className="flex-1">
            Confirm Payment
          </Button>
          <Button
            onClick={handleRequestReport}
            variant="outline"
            className="flex-1"
          >
            Request Report
          </Button>
        </div>
        <div className="text-sm font-semibold mb-2">
          HealthCare Diagnostics, Inc.
        </div>
      </CardFooter>
    </Card>
  );
}
