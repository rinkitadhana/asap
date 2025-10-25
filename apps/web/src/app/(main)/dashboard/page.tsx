"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProtectedRoute from "@/shared/components/ProtectedRoute";

const Main = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/home");
  }, [router]);

  return (
    <ProtectedRoute>
      {null}
    </ProtectedRoute>
  );
};

export default Main;
