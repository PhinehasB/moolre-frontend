"use client";

import { LogOut } from "lucide-react";
import { useSignOut } from "@/hooks/use-auth";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function LogoutDialog() {
  const signOut = useSignOut();
  const router = useRouter();

  const handleLogout = () => {
    signOut.mutate(undefined, {
      onSettled: () => router.push("/signin"),
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={signOut.isPending}
          title="Sign out"
          className="group-data-[state=collapsed]:hidden ml-auto shrink-0 flex items-center justify-center size-8 rounded-lg text-red-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Sign out"
        >
          {signOut.isPending ? (
            <svg className="size-4 animate-spin text-red-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <LogOut className="size-4" />
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-0 shadow-2xl rounded-[1.5rem] gap-0 bg-white">
        <div className="p-8 pb-10">
          <AlertDialogHeader className="text-left items-start sm:text-left sm:items-start flex flex-col gap-0">
            <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <LogOut className="size-6 text-red-600 ml-1" />
            </div>
            <AlertDialogTitle className="text-[28px] font-bold text-gray-900 mb-4 font-serif tracking-tight leading-tight">
              Ready to leave?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-base leading-relaxed max-w-[340px]">
              You will need to sign back in to manage your payroll and team.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter className="bg-[#f8f9fa] border-t border-gray-100 p-8 sm:flex-col gap-3 sm:space-x-0 w-full m-0">
          <AlertDialogAction
            onClick={handleLogout}
            className="w-full bg-red-600 text-white hover:bg-red-700 rounded-xl h-12 text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-red-600/40 shadow-sm"
          >
            Yes, log me out
          </AlertDialogAction>
          <AlertDialogCancel className="w-full m-0 border border-gray-200 bg-transparent text-primary-700 hover:bg-gray-100/50 rounded-xl h-12 text-[15px] font-semibold hover:text-primary-700 transition-colors">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
