"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("vader_token");
    if (token) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === null) {
    return <div className="min-h-screen bg-transparent" />; 
  }

  return (
    <>
      {isAuthorized ? children : <div className="min-h-screen opacity-20 pointer-events-none">{children}</div>}
      
      <AlertDialog open={isAuthorized === false}>
        <AlertDialogContent className="bg-zinc-950 border-red-900 text-white sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-500">Access Restricted</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-300">
              You must be logged into your Vader-Verse account to access this content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel 
              onClick={() => router.push("/")}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"
            >
              Return Home
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.push("/login")}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Log in
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
