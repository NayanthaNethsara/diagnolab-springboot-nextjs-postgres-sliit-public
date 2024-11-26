"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, ToggleRight, ToggleLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

type Test = {
  id: string;
  testName: string;
  testPrice: number;
  sampleType: string;
  testDescription: string;
  refRange: string;
  availability: boolean;
};

export default function LabTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmAvailabilityTest, setConfirmAvailabilityTest] =
    useState<Test | null>();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session } = useSession();

  // Fetch tests when the component loads
  useEffect(() => {
    // Fetch tests from the backend
    if (session?.user?.access_token) {
      fetch(`${baseUrl}/api/Tests/all`, {
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setTests(data))
        .catch((error) => console.error("Error fetching tests data:", error));
    }
  }, [baseUrl, session]);

  const handleEditTest = (test: Test) => {
    setEditingTest(test);
    setIsDialogOpen(true);
  };

  const handleUpdateTest = () => {
    if (editingTest && session?.user?.access_token) {
      fetch(`${baseUrl}/api/Tests/update/${editingTest.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTest),
      })
        .then((response) => response.json())
        .then((updatedTest) => {
          setTests((prev) =>
            prev.map((test) =>
              test.id === updatedTest.id ? updatedTest : test
            )
          );
          setEditingTest(null);
          setIsDialogOpen(false);
        })
        .catch((error) => console.error("Error updating test:", error));
    }
  };

  const handleAddNewTest = () => {
    setEditingTest({
      id: "",
      testName: "",
      testPrice: 0,
      testDescription: "",
      sampleType: "",
      refRange: "",
      availability: true,
    });
    setIsDialogOpen(true);
  };

  const handleSaveTest = () => {
    if (editingTest && session?.user?.access_token) {
      if (tests.some((test) => test.id === editingTest.id)) {
        handleUpdateTest();
      } else {
        // Backend create call
        console.log("Creating test:", editingTest);
        fetch(`${baseUrl}/api/Tests/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.user.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingTest),
        })
          .then((response) => response.json())
          .then((newTest) => {
            setTests((prev) => [...prev, newTest]);
            setEditingTest(null);
            setIsDialogOpen(false);
          })
          .catch((error) => console.error("Error creating test:", error));
      }
    }
  };

  const handleToggleAvailability = (test: Test) => {
    setConfirmAvailabilityTest(test);
  };

  const confirmToggleAvailability = () => {
    if (confirmAvailabilityTest && session?.user?.access_token) {
      const updatedTest = {
        ...confirmAvailabilityTest,
        availability: !confirmAvailabilityTest.availability,
      };

      // Backend update call
      fetch(`${baseUrl}/api/Tests/availability/${confirmAvailabilityTest.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTest),
      })
        .then((response) => response.json())
        .then((updatedTest) => {
          setTests((prev) =>
            prev.map((test) =>
              test.id === updatedTest.id ? updatedTest : test
            )
          );
          setConfirmAvailabilityTest(null); // Close dialog
        })
        .catch((error) => console.error("Error updating availability:", error));
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Lab Tests</CardTitle>
            <CardDescription>
              Manage available tests and add new tests to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tests..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleAddNewTest}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Test
              </Button>
            </div>
            <ScrollArea className="h-max-[700px] pr-4">
              {filteredTests.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No tests available.
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTests
                  .sort((a, b) =>
                    a.id.toString().localeCompare(b.id.toString())
                  )
                  .map((test) => (
                    <Card
                      key={test.id}
                      className={`transition-all hover:border-primary/50 ${
                        test.availability ? "bg-white" : "bg-gray-100"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">
                            {test.testName}
                          </h3>
                          <span className="font-semibold">
                            {test.testPrice} LKR
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {test.testDescription}
                        </p>
                        <div className="text-sm mb-2">
                          <span>Sample: {test.sampleType}</span>
                        </div>
                        <div className="text-sm mb-4">
                          <span>Reference Range: {test.refRange}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTest(test)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              test.availability ? "default" : "secondary"
                            }
                            onClick={() => handleToggleAvailability(test)}
                          >
                            {test.availability ? (
                              <ToggleRight className="h-4 w-4 mr-2" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 mr-2" />
                            )}
                            {test.availability ? "Available" : "Unavailable"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTest?.id ? "Edit Test" : "Add New Test"}
            </DialogTitle>
            <DialogDescription>
              {editingTest?.id
                ? "Update the details of the test below."
                : "Enter the details of the new test below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingTest?.id && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="testId" className="text-right">
                  ID
                </Label>
                <Input
                  id="testId"
                  value={editingTest.id}
                  className="col-span-3"
                  disabled
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testName" className="text-right">
                Name
              </Label>
              <Input
                id="testName"
                value={editingTest?.testName || ""}
                onChange={(e) =>
                  setEditingTest((prev) =>
                    prev ? { ...prev, testName: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testPrice" className="text-right">
                Price
              </Label>
              <Input
                id="testPrice"
                type="number"
                value={editingTest?.testPrice || 0}
                onChange={(e) =>
                  setEditingTest((prev) =>
                    prev
                      ? { ...prev, testPrice: parseFloat(e.target.value) }
                      : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testDescription" className="text-right">
                Description
              </Label>
              <Input
                id="testDescription"
                value={editingTest?.testDescription || ""}
                onChange={(e) =>
                  setEditingTest((prev) =>
                    prev ? { ...prev, testDescription: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            {
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sampleType" className="text-right">
                  Sample Type
                </Label>
                <Select
                  value={editingTest?.sampleType || ""}
                  onValueChange={(value) =>
                    setEditingTest((prev) =>
                      prev ? { ...prev, sampleType: value.toUpperCase() } : null
                    )
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Sample Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLOOD">Blood</SelectItem>
                    <SelectItem value="URINE">Urine</SelectItem>
                    <SelectItem value="STOOL">Stool</SelectItem>
                    <SelectItem value="SALIVA">Saliva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="refRange" className="text-right">
                Reference Range
              </Label>
              <Input
                id="refRange"
                value={editingTest?.refRange || ""}
                onChange={(e) =>
                  setEditingTest((prev) =>
                    prev ? { ...prev, refRange: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveTest}>
              {editingTest?.id ? "Update Test" : "Add Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!confirmAvailabilityTest}
        onOpenChange={() => setConfirmAvailabilityTest(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Availability Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the availability of &quot;
              {confirmAvailabilityTest?.testName} &quot; to{" "}
              {confirmAvailabilityTest?.availability
                ? "unavailable"
                : "available"}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleAvailability}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
