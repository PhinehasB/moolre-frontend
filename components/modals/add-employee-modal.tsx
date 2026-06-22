"use client";

import { Modal } from "@/components/ui/modal";
import { Employee } from "@/interfaces/tables.interface";
import { useState } from "react";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: Employee, sendInvite: boolean) => void;
  currentCount: number;
}

export function AddEmployeeModal({
  isOpen,
  onClose,
  onAdd,
  currentCount,
}: AddEmployeeModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [sendInvite, setSendInvite] = useState(true);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setSalary("");
    setSendInvite(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) return;

    const colors = [
      "bg-green-50 text-green-600",
      "bg-orange-50 text-orange-600",
      "bg-[#ede7f6] text-[#4a148c]",
      "bg-[#e3f2fd] text-[#0d47a1]",
      "bg-[#efebe9] text-[#3e2723]",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const parsedSalary = parseInt(salary.replace(/[^0-9]/g, ""), 10);

    const newEmployee: Employee = {
      id: String(currentCount + 1),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim() || `${firstName.toLowerCase()}@techcorp.com`,
      phone: phone.trim() || "+233 00 000 0000",
      wallet: "Provisioning",
      status: "Pending",
      salary: isNaN(parsedSalary) ? 4000 : parsedSalary,
      avatarColor: randomColor,
    };

    onAdd(newEmployee, sendInvite);
    resetForm();
  };

  const isValid = firstName.trim() && lastName.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add employee"
      description="We'll create their Moolre wallet and email their login."
      footer={
        <>
          <button
            onClick={handleClose}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm active:scale-95 duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add employee
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* First name / Last name */}
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
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
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
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kwame@techcorp.com"
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+233 24 000 0000"
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
          />
        </div>

        {/* Salary */}
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
              className="w-full pl-12 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
            />
          </div>
        </div>

        {/* Send invite checkbox */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={sendInvite}
            onChange={(e) => setSendInvite(e.target.checked)}
            className="size-4 rounded border-gray-300 accent-green-600 cursor-pointer"
          />
          <span className="text-sm text-gray-700">
            Send their login credentials and app invitation now
          </span>
        </label>
      </div>
    </Modal>
  );
}
