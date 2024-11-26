"use client";
import { useRouter } from "next/navigation";

const LabManagementPage = () => {
  const router = useRouter();
  router.push("LabManagement/request-test");

  return <></>;
};

export default LabManagementPage;
