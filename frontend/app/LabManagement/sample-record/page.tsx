"use client";

import { use, useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSession } from "next-auth/react";

type RequestedTest = {
  testId: number;
  testName: string;
  result?: string;
};

type Sample = {
  sampleId: number;
  sampleType: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  collectedDate: string;
  completedDate: string;
  barcode: string;
  collectedBy: string;
  requestedTests: RequestedTest[];
};

const initialSamples: Sample[] = [];

export default function SampleManagement() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [editingSample, setEditingSample] = useState<Sample | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTestResultDialogOpen, setIsTestResultDialogOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.access_token) {
      fetch(`${baseUrl}/api/Sample/all`, {
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setSamples(data))
        .catch((error) => console.error("Error fetching sample data:", error));
    }
  }, [baseUrl, session]);

  const filteredSamples = samples.filter((sample) =>
    Object.values(sample).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const handleEdit = (sample: Sample) => {
    setEditingSample(sample);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingSample) {
      setSamples(
        samples.map((s) =>
          s.sampleId === editingSample.sampleId ? editingSample : s
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleAddTestResult = (sample: Sample) => {
    setEditingSample(sample);
    setIsTestResultDialogOpen(true);
  };

  const handleSaveTestResult = () => {
    if (editingSample) {
      setSamples(
        samples.map((s) =>
          s.sampleId === editingSample.sampleId ? editingSample : s
        )
      );
      setIsTestResultDialogOpen(false);
    }
  };

  return (
    <main className="grid flex-1 p-4 sm:px-4 sm:py-0 ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sample Management</CardTitle>
          <CardDescription>
            Manage available samples and add new test result to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sample..."
                className="pl-8"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sample
            </Button>
          </div>
          <ScrollArea className="h-[700px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSamples.map((sample) => (
                <Card key={sample.sampleId} className="w-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{sample.patientName}</CardTitle>
                        <CardDescription>{sample.patientId}</CardDescription>
                      </div>
                      <div className="">
                        <Badge
                          variant={
                            sample.status === "COMPLETED"
                              ? "default"
                              : sample.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {sample.status}
                        </Badge>
                        <p className="font-mono">{sample.barcode}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium">Sample Type</p>
                        <p className="text-sm">
                          {sample.sampleType.charAt(0).toUpperCase() +
                            sample.sampleType.slice(1).toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Collected By:</p>
                        <p className="text-sm">
                          {sample.collectedBy.charAt(0).toUpperCase() +
                            sample.collectedBy.slice(1).toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Collected Date:</p>
                        <p className="text-sm">
                          {new Date(sample.collectedDate).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Completed Date:</p>
                        <p className="text-sm">
                          {new Date(sample.completedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        Requested Tests:
                      </p>
                      <Table>
                        <TableBody>
                          {sample.requestedTests.map((test) => (
                            <TableRow key={test.testId}>
                              <TableCell className="font-medium">
                                {test.testName}
                              </TableCell>
                              <TableCell>{test.result || "Pending"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(sample)}
                    >
                      Edit Sample
                    </Button>
                    <Button onClick={() => handleAddTestResult(sample)}>
                      Add Test Result
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sample</DialogTitle>
          </DialogHeader>
          {editingSample && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingSample.status}
                  onValueChange={(value) =>
                    setEditingSample({
                      ...editingSample,
                      status: value as Sample["status"],
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="collectedDate" className="text-right">
                  Collected Date
                </Label>
                <Input
                  id="collectedDate"
                  type="datetime-local"
                  value={editingSample.collectedDate.slice(0, 16)}
                  onChange={(e) =>
                    setEditingSample({
                      ...editingSample,
                      collectedDate: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="completedDate" className="text-right">
                  Completed Date
                </Label>
                <Input
                  id="completedDate"
                  type="datetime-local"
                  value={editingSample.completedDate?.slice(0, 16)}
                  onChange={(e) =>
                    setEditingSample({
                      ...editingSample,
                      completedDate: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <Button onClick={handleSaveEdit}>Save Changes</Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTestResultDialogOpen}
        onOpenChange={setIsTestResultDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Test Results</DialogTitle>
          </DialogHeader>
          {editingSample && (
            <div className="grid gap-4 py-4">
              <p>Add test results for Sample ID: {editingSample.sampleId}</p>
              {editingSample.requestedTests.map((test) => (
                <div
                  key={test.testId}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={`test-${test.testId}`} className="text-right">
                    {test.testName}
                  </Label>
                  <Input
                    id={`test-${test.testId}`}
                    value={test.result || ""}
                    onChange={(e) => {
                      const updatedTests = editingSample.requestedTests.map(
                        (t) =>
                          t.testId === test.testId
                            ? { ...t, result: e.target.value }
                            : t
                      );
                      setEditingSample({
                        ...editingSample,
                        requestedTests: updatedTests,
                      });
                    }}
                    className="col-span-3"
                    placeholder="Enter test result"
                  />
                </div>
              ))}
              <Button onClick={handleSaveTestResult}>Save Test Results</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
