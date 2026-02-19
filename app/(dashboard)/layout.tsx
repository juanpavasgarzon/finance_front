"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api/client";
import { AppNav } from "@/components/layout/AppNav";
import { Footer } from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNav />
      <main className="container mx-auto flex-1 w-full max-w-[1600px] px-3 py-3 sm:px-5 sm:py-4 lg:px-6">{children}</main>
      <Footer />
    </div>
  );
}
