"use client";
import { ListFilter, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientWithRecentTests, columns } from "./columns";
import { DataTable } from "./PatientTable";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    user: {
      access_token?: string;
    };
  }
}

export default function PatientRecord() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession();

  const [data, setData] = useState<PatientWithRecentTests[]>([]);

  useEffect(() => {
    if (session?.user?.access_token) {
      fetch(`http://localhost:8080/api/Patient/SummeryWithRecentTests/all`, {
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const transformedData = data.map((item: PatientWithRecentTests) => ({
            ...item,
            reportState:
              item.reportState.toUpperCase() === "COMPLETED"
                ? "Completed"
                : item.reportState.toUpperCase() === "PENDING"
                ? "Pending"
                : "IN_PROGRESS",
          }));
          setData(transformedData);
        })
        .catch((error) => console.error("Error fetching tests data:", error));
    }
  }, [session, baseUrl]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/LabManagement/add-patient">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3 w-3" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Patient
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>
                View and manage patient records here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Pending Patient Records</CardTitle>
              <CardDescription>
                View and manage patient records here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data.filter(
                  (patient) => patient.reportState === "Pending"
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Completed Patient Records</CardTitle>
              <CardDescription>
                View and manage patient records here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data.filter(
                  (patient) => patient.reportState === "Completed"
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inprogress">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>In Progress Patient Record</CardTitle>
              <CardDescription>
                View and manage patient records here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data.filter(
                  (patient) => patient.reportState === "In Progress"
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
