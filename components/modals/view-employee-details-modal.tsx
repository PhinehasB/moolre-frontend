"use client";

import { Modal } from "@/components/ui/modal";
import type { Employee } from "@/interfaces/tables.interface.tsx";

interface ViewEmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

export function ViewEmployeeDetailsModal({
  isOpen,
  onClose,
  employee,
}: ViewEmployeeDetailsModalProps) {
  if (!employee) return null;

  const parts = employee.name.split(" ");
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ") ?? "";
  const role = (employee as any).role ?? "Employee";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="View employee"
      description="Read-only details for this employee."
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors ml-auto"
        >
          Close
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              First name
            </label>
            <input
              type="text"
              value={firstName}
              readOnly
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none select-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Last name
            </label>
            <input
              type="text"
              value={lastName}
              readOnly
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none select-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={employee.email ?? ""}
            readOnly
            className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none select-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone number
          </label>
          <input
            type="tel"
            value={employee.phone ?? ""}
            readOnly
            className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none select-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Job role
          </label>
          <input
            type="text"
            value={role}
            readOnly
            className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none select-all"
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
              value={employee.salary ? employee.salary.toLocaleString() : ""}
              readOnly
              className="w-full pl-12 pr-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none select-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <input
            type="text"
            value={employee.status ?? "Active"}
            readOnly
            className="w-full px-3.5 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none select-all"
          />
        </div>
      </div>
    </Modal>
  );
}
