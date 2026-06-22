"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [automaticPayroll, setAutomaticPayroll] = useState(true);
  const [emailEstimate, setEmailEstimate] = useState(true);
  const [notifyEmployees, setNotifyEmployees] = useState(true);

  return (
    <div className="flex w-full max-w-155 flex-col gap-5 animate-in fade-in duration-300">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-7">
          <h2 className="text-base font-bold text-gray-900">
            Payroll automation
          </h2>
          <p className="mt-1 text-xs font-medium text-gray-500">
            Klare runs payroll automatically so you don&apos;t have to remember.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Automatic payroll
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Pay active employees every month
            </p>
          </div>
          <button
            type="button"
            aria-pressed={automaticPayroll}
            onClick={() => setAutomaticPayroll((value) => !value)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              automaticPayroll ? "bg-green-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${
                automaticPayroll ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-5">
          <label
            htmlFor="pay-date"
            className="text-sm font-semibold text-gray-900"
          >
            Pay date
          </label>
          <select
            id="pay-date"
            defaultValue="28th of the month"
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          >
            <option>25th of the month</option>
            <option>28th of the month</option>
            <option>Last day of the month</option>
          </select>
        </div>

        <label className="flex items-center gap-3 border-b border-gray-100 py-5 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={emailEstimate}
            onChange={(event) => setEmailEstimate(event.target.checked)}
            className="size-4 rounded border-gray-300 accent-green-600"
          />
          Email me an estimate 5 days before each run
        </label>

        <label className="flex items-center gap-3 pt-5 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={notifyEmployees}
            onChange={(event) => setNotifyEmployees(event.target.checked)}
            className="size-4 rounded border-gray-300 accent-green-600"
          />
          Notify employees 2 days before payday
        </label>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Company profile</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs font-medium text-gray-700">
            Company name
            <input
              defaultValue="TechCorp Ltd"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </label>

          <label className="flex flex-col gap-2 text-xs font-medium text-gray-700">
            Registration no.
            <input
              defaultValue="CS-244-0091"
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-2 text-xs font-medium text-gray-700">
          Admin email
          <input
            type="email"
            defaultValue="ama@techcorp.com"
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </label>

        <button
          type="button"
          onClick={() => alert("Company profile saved")}
          className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
        >
          Save changes
        </button>
      </section>

      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-red-600">Security</h2>
        <p className="mt-1 text-xs font-medium text-gray-500">
          Manage how you sign in.
        </p>
        <button
          type="button"
          onClick={() => alert("Password change flow")}
          className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
        >
          Change password
        </button>
      </section>
    </div>
  );
}
