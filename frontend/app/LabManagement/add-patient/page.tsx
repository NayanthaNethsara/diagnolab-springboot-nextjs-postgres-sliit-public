"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

interface RequiredData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
}

const formSchema = z.object({
  patientId: z.string(),
  firstName: z.string().min(1, { message: "First name is required" }).max(50),
  lastName: z.string().min(1, { message: "Last name is required" }).max(50),
  dateOfBirth: z.string().refine(
    (val) => {
      const date = Date.parse(val);
      const minDate = new Date("1920-01-01").getTime();
      const maxDate = new Date().getTime();
      return !isNaN(date) && date >= minDate && date <= maxDate;
    },
    {
      message: "Date of birth must be between 1920 and today",
    }
  ),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  nic: z
    .string()
    .max(12, { message: "NIC must be at most 12 characters" })
    .optional(),
  phoneNumber: z
    .string()
    .max(15, { message: "Phone number must be at most 15 characters" })
    .optional(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100)
    .optional(),
  address: z.string().optional(),
  city: z
    .string()
    .max(50, { message: "City must be at most 50 characters" })
    .optional(),
  zipCode: z
    .string()
    .max(10, { message: "Zip code must be at most 10 characters" })
    .optional(),
  emergencyContactName: z
    .string()
    .max(100, {
      message: "Emergency contact name must be at most 100 characters",
    })
    .optional(),
  emergencyContactPhone: z
    .string()
    .max(15, {
      message: "Emergency contact phone must be at most 15 characters",
    })
    .optional(),
  notes: z.string().optional(),
});

export default function AddPatientForm() {
  const [generatedPatientId, setGeneratedPatientId] = useState("");
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [generateData, setGenerateData] = useState<RequiredData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    gender: "MALE",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "MALE",
      phoneNumber: "",
      nic: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      notes: "",
    },
  });

  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    setGeneratedPatientId(generatePatientId(generateData));
  }, [generateData]);

  const generatePatientId = (data: RequiredData) => {
    const { firstName, lastName, dateOfBirth, phoneNumber, gender } = data;
    const genderCode =
      gender === "MALE" ? "M" : gender === "FEMALE" ? "F" : "O";
    const nameCode = ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase();
    const dobCode = dateOfBirth.replace(/-/g, "").slice(2);
    const phoneCode = phoneNumber.slice(-3);
    const randomCode = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `P${genderCode}${nameCode}${dobCode}${phoneCode}${randomCode}`;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updatedValues = { ...values, patientId: generatedPatientId };
    if (session?.user?.access_token) {
      try {
        // Check if the patient already exists
        const checkResponse = await fetch(
          `${baseUrl}/api/Patient/Check/${generatedPatientId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!checkResponse.ok) {
          throw new Error(
            `Error checking patient: ${checkResponse.statusText}`
          );
        }

        const { exists } = await checkResponse.json();

        if (exists) {
          setSubmitStatus({
            type: "error",
            message: "A patient with this ID already exists.",
          });
          return;
        }

        // If patient doesn't exist, proceed with adding the new patient
        const addResponse = await fetch(`${baseUrl}/api/Patient/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.user.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedValues),
        });

        if (!addResponse.ok) {
          throw new Error(`Error adding patient: ${addResponse.statusText}`);
        }

        const addData = await addResponse.json();
        console.log("Response data:", addData);
        setSubmitStatus({
          type: "success",
          message: "Patient added successfully!",
        });
        form.reset(); // Reset the form after successful submission
      } catch (error) {
        console.error("Failed to submit data:", error);
        setSubmitStatus({
          type: "error",
          message: "Failed to add patient. Please try again.",
        });
      }
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3">
      <Card className="w-full col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Add New Patient</CardTitle>
          <CardDescription>
            Please fill out the form below to add a new patient to the system.
            Ensure all required fields are completed accurately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitStatus.type && (
            <Alert
              variant={
                submitStatus.type === "success" ? "default" : "destructive"
              }
              className="mb-6"
            >
              {submitStatus.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {submitStatus.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{submitStatus.message}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        value={generatedPatientId}
                        onChange={() => {}}
                      />
                    </FormControl>
                    <FormDescription>
                      Auto-generated based on patient information
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setGenerateData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setGenerateData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            onChange={(e) => {
                              field.onChange(e);
                              setGenerateData((prev) => ({
                                ...prev,
                                dateOfBirth: e.target.value,
                              }));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setGenerateData((prev) => ({
                              ...prev,
                              gender: value,
                            }));
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="nic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIC</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setGenerateData((prev) => ({
                              ...prev,
                              phoneNumber: e.target.value,
                            }));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Add Patient
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <Card className="w-full ">
          <CardHeader className="pb-3">
            <CardTitle>Important Information</CardTitle>
            <CardDescription>
              Please ensure all required fields are completed accurately.
              Patient ID is auto-generated based on the patient&apos;s
              information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              The patient ID is generated based on the patient&apos;s first
              name, last name, date of birth
              <br />
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle>Help & Support</CardTitle>
            <CardDescription>
              If you need any help or support, please contact us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              If you have any questions or need help with the form, please
              contact us at
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
