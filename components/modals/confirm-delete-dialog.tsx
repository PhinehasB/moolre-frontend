"use client";

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
import { Trash2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Display name of the item being deleted */
  name: string;
  /** Optional secondary context line shown below the name */
  subtitle?: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  name,
  subtitle,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl gap-0 bg-white">
        {/* Icon header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-50 mb-5">
            <Trash2 className="size-5 text-red-600" />
          </div>

          <AlertDialogHeader className="text-left items-start sm:text-left sm:items-start flex flex-col gap-0 p-0">
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 mb-1.5">
              Delete {name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
              {subtitle ??
                `Are you sure you want to remove ${name} from your team? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="bg-gray-50 border-t border-gray-100 px-8 pb-10 pt-5 flex flex-row gap-3 sm:flex-row sm:space-x-0">
          <AlertDialogCancel
            disabled={isDeleting}
            className="flex-1 m-0 h-10 text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl transition-colors"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="flex-1 h-10 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting…" : "Yes, delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
