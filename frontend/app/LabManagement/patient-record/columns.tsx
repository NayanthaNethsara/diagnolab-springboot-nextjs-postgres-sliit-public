"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import RecentTestsCell from "./RecentTest";
import Link from "next/link";

export type PatientWithRecentTests = {
  id: number;
  patientId: string;
  firstName: string;
  lastName: string;
  age: number;
  recentAppointment: string | null;
  recentTests: string[];
  reportState: "Completed" | "Pending" | "In Progress";
};

export const columns: ColumnDef<PatientWithRecentTests>[] = [
  {
    accessorKey: "patientId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("patientId")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        <Link href={`patient-record/${row.original.patientId}`}>
          {`${row.original.firstName} ${row.original.lastName}`}
        </Link>
      </div>
    ),
  },

  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("age")}</div>
    ),
  },
  {
    accessorKey: "recentAppointment",
    header: "Recent Appointment",
    cell: ({ row }) => (
      <div>{row.getValue("recentAppointment") || "No Appointment"}</div>
    ),
  },
  {
    accessorKey: "recentTests",
    header: "Recent Tests",
    cell: ({ row }) => <RecentTestsCell tests={row.original.recentTests} />,
    filterFn: (row, _id, value) => {
      return row.original.recentTests.some((test) =>
        test.toLowerCase().includes(value.toLowerCase())
      );
    },
  },
  {
    accessorKey: "reportState",
    header: "Report State",
    cell: ({ row }) => (
      <>
        {row.original.reportState === "Completed" && (
          <Badge variant="default">{row.getValue("reportState")}</Badge>
        )}
        {row.original.reportState === "Pending" && (
          <Badge variant="destructive">{row.getValue("reportState")}</Badge>
        )}
        {row.original.reportState === "In Progress" && (
          <Badge variant="secondary">{row.getValue("reportState")}</Badge>
        )}
      </>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  patient.firstName + " " + patient.lastName
                )
              }
            >
              Copy patient name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`patient-record/${patient.patientId}#patient-details`}>
              <DropdownMenuItem>View patient details</DropdownMenuItem>
            </Link>
            <Link href={`patient-record/${patient.patientId}#medical-history`}>
              <DropdownMenuItem>View medical history</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
