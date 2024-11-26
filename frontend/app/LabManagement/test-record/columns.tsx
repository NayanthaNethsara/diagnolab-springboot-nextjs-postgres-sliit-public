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
import ExpandableTestsTable from "./testValues";

export interface Test {
  name: string;
  value: string | number;
  unit: string;
}

export interface TestResult {
  patientName: string;
  patientId: string;
  testName: string;
  tests: Test[];
  date: string;
  status: "Completed" | "In Progress" | "Pending";
}

export const columns: ColumnDef<TestResult>[] = [
  {
    accessorKey: "patientName",
    header: "Patient Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("patientName")}</div>
    ),
  },
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => <div>{row.getValue("patientId")}</div>,
  },
  {
    accessorKey: "testName",
    header: "Test Name",
    cell: ({ row }) => <div>{row.getValue("testName")}</div>,
  },
  {
    accessorKey: "values",
    header: "Values",
    cell: ({ row }) => {
      const tests = (row.getValue("values") as Test[]) || [];

      return <ExpandableTestsTable tests={tests} />;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Completed"
              ? "default"
              : status === "In Progress"
              ? "secondary"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
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
              onClick={() => navigator.clipboard.writeText(patient.patientName)}
            >
              Copy patient ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View patient details</DropdownMenuItem>
            <DropdownMenuItem>View test results</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
