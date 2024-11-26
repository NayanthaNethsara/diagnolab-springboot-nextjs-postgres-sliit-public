"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    user: {
      access_token?: string;
    };
  }
}
export type SelectedTest = {
  id: string;
  name: string;
  price: number;
};
type Test = {
  id: string;
  name: string;
  price: number;
  sampleType: string;
  description: string;
};

interface RequestTestsProps {
  selectedTests: SelectedTest[]; // Array of selected test objects
  setSelectedTests: React.Dispatch<React.SetStateAction<SelectedTest[]>>; // Function to update selected tests
}

export default function RequestTests({
  selectedTests,
  setSelectedTests,
}: RequestTestsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [testData, setTestData] = useState<Test[]>([]);
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (session?.user?.access_token) {
      fetch(`${baseUrl}/api/Tests/card/available`, {
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setTestData(data))
        .catch((error) => console.error("Error fetching tests data:", error));
    }
  }, [session, baseUrl]);

  // Handle test selection and deselection
  const handleTestSelection = (test: Test) => {
    const isSelected = selectedTests.some(
      (selected) => selected.id === test.id
    );

    if (isSelected) {
      // Deselect the test if it's already selected
      setSelectedTests((prev) =>
        prev.filter((selected) => selected.id !== test.id)
      );
    } else {
      // Add the test to selectedTests
      setSelectedTests((prev) => [
        ...prev,
        { id: test.id, name: test.name, price: test.price },
      ]);
    }
  };

  const filteredTests = testData.filter(
    (test) =>
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="px-7">
        <CardTitle className="text-lg">Request Tests</CardTitle>
        <CardDescription>
          Choose the tests you want to request for the patient. Click on a test
          to select or deselect it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-max-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <Card
                key={test.id}
                className={`cursor-pointer transition-all ${
                  selectedTests.some((selected) => selected.id === test.id)
                    ? "border-primary shadow-md"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleTestSelection(test)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{test.name}</h3>
                    <Badge
                      variant={
                        selectedTests.some(
                          (selected) => selected.id === test.id
                        )
                          ? "default"
                          : "outline"
                      }
                    >
                      {selectedTests.some((selected) => selected.id === test.id)
                        ? "Selected"
                        : "Select"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-normal">
                      Sample: {test.sampleType}
                    </span>
                    <span className="font-semibold">{test.price} LKR</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {test.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary">Selected: {selectedTests.length}</Badge>
      </CardFooter>
    </Card>
  );
}
