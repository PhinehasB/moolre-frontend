"use client";

import { Modal } from "@/components/ui/modal";
import type { Employee } from "@/interfaces/tables.interface.tsx";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: Employee | null;
  onUpdate: (payload: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    monthlySalary: number;
    status: "Active" | "Pending" | "Suspended";
  }) => void;
  onDelete?: (employeeId: string) => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

export function EditEmployeeModal({
  isOpen,
  onClose,
  initial = null,
  onUpdate,
  onDelete,
  isSubmitting = false,
  isDeleting = false,
}: EditEmployeeModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Employee");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState<"Active" | "Pending" | "Suspended">(
    "Active",
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!initial) return;
    const parts = initial.name.split(" ");
    setFirstName(parts.shift() ?? "");
    setLastName(parts.join(" ") ?? "");
    setEmail(initial.email ?? "");
    setPhone(initial.phone ?? "");
    setRole((initial as any).role ?? "Employee");
    setSalary(String(initial.salary ?? ""));
    setStatus(initial.status ?? "Active");
    setConfirmingDelete(false);
  }, [initial]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole("Employee");
    setSalary("");
    setStatus("Active");
    setConfirmingDelete(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!initial) return;
    const parsedSalary = parseFloat(salary.replace(/[^0-9.]/g, ""));
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      return;
    }
    if (!Number.isFinite(parsedSalary) || parsedSalary <= 0) return;

    onUpdate({
      id: initial.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role.trim() || "Employee",
      monthlySalary: parsedSalary,
      status,
    });
  };

  const handleDeleteConfirm = () => {
    if (!initial) return;
    onDelete?.(initial.id);
  };

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phone.trim() &&
    Number.isFinite(parseFloat(salary.replace(/[^0-9.]/g, ""))) &&
    parseFloat(salary.replace(/[^0-9.]/g, "")) > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={confirmingDelete ? "Remove employee" : "Edit employee"}
      description={
        confirmingDelete
          ? `Are you sure you want to remove ${initial?.name ?? "this employee"}? They will no longer appear in your team or payroll.`
          : "Update employee details and status."
      }
      footer={
        confirmingDelete ? (
          <>
            <button
              onClick={() => setConfirmingDelete(false)}
              disabled={isDeleting}
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm active:scale-95 duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Removing…" : "Yes, remove"}
            </button>
          </>
        ) : (
          <>
            {onDelete && (
              <button
                onClick={() => setConfirmingDelete(true)}
                disabled={isSubmitting}
                className="mr-auto px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
              >
                Remove employee
              </button>
            )}
            <button
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm active:scale-95 duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </button>
          </>
        )
      }
    >
      {confirmingDelete ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-7 text-red-500" />
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            Their Klare account, wallet, and transaction history will remain
            intact so they can continue using Klare personally.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Kwame"
                className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Essien"
                className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kwame@techcorp.com"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 24 000 0000"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Job role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Software Engineer"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Monthly salary
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium select-none">
                GHS
              </span>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="5,000"
                className="w-full pl-12 pr-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      )}
    </Modal>
  );
}
