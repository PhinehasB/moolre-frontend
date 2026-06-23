"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getApiError } from "@/hooks/use-auth";
import {
  useChangePassword,
  useSettings,
  useUpdateCompanyProfile,
  useUpdatePayrollAutomation,
} from "@/hooks/use-dashboard";
import { strongPasswordSchema } from "@/utils/validators";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PAY_DATE_OPTIONS = [25, 28, 30];

export default function SettingsPage() {
  const { data, isLoading } = useSettings();
  const updateAutomation = useUpdatePayrollAutomation();
  const updateProfile = useUpdateCompanyProfile();
  const changePassword = useChangePassword();

  const settings = data?.data;

  const [automaticPayroll, setAutomaticPayroll] = useState(true);
  const [payDate, setPayDate] = useState(28);
  const [emailEstimate, setEmailEstimate] = useState(true);
  const [notifyEmployees, setNotifyEmployees] = useState(true);

  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const [mounted, setMounted] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!settings) return;
    setAutomaticPayroll(settings.payrollAutomation.automaticPayroll);
    setPayDate(settings.payrollAutomation.payDate);
    setEmailEstimate(settings.payrollAutomation.emailEstimateBeforeRun);
    setNotifyEmployees(settings.payrollAutomation.notifyEmployeesBeforePayday);
    setCompanyName(settings.companyProfile.companyName);
    setRegistrationNumber(settings.companyProfile.registrationNumber);
    setAdminEmail(settings.companyProfile.adminEmail);
  }, [settings]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveAutomation = async () => {
    try {
      await updateAutomation.mutateAsync({
        automaticPayroll,
        payDate,
        emailEstimateBeforeRun: emailEstimate,
        notifyEmployeesBeforePayday: notifyEmployees,
      });
      toast.success("Payroll automation settings saved.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        companyName,
        registrationNumber,
        adminEmail,
      });
      toast.success("Company profile saved.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    const parsed = strongPasswordSchema.safeParse(newPassword);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid password.");
      return;
    }

    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

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
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-32 mt-2" />
          </div>
        ) : (
          <>
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
                disabled={mounted ? Boolean(isLoading) : undefined}
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
                value={payDate}
                onChange={(event) => setPayDate(Number(event.target.value))}
                disabled={mounted ? Boolean(isLoading) : undefined}
                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              >
                {PAY_DATE_OPTIONS.map((day) => (
                  <option key={day} value={day}>
                    {day}th of the month
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 border-b border-gray-100 py-5 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={emailEstimate}
                onChange={(event) => setEmailEstimate(event.target.checked)}
                disabled={mounted ? Boolean(isLoading) : undefined}
                className="size-4 rounded border-gray-300 accent-green-600"
              />
              Email me an estimate 5 days before each run
            </label>

            <label className="flex items-center gap-3 pt-5 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={notifyEmployees}
                onChange={(event) => setNotifyEmployees(event.target.checked)}
                disabled={mounted ? Boolean(isLoading) : undefined}
                className="size-4 rounded border-gray-300 accent-green-600"
              />
              Notify employees 2 days before payday
            </label>

            <button
              type="button"
              onClick={handleSaveAutomation}
              disabled={
                mounted
                  ? Boolean(updateAutomation.isPending || isLoading)
                  : undefined
              }
              className="mt-6 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-60"
            >
              {updateAutomation.isPending ? "Saving…" : "Save automation"}
            </button>
          </>
        )}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Company profile</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs font-medium text-gray-700">
            Company name
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              disabled={mounted ? Boolean(isLoading) : undefined}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </label>

          <label className="flex flex-col gap-2 text-xs font-medium text-gray-700">
            Registration no.
            <input
              value={registrationNumber}
              onChange={(event) => setRegistrationNumber(event.target.value)}
              disabled={mounted ? Boolean(isLoading) : undefined}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-2 text-xs font-medium text-gray-700">
          Admin email
          <input
            type="email"
            value={adminEmail}
            onChange={(event) => setAdminEmail(event.target.value)}
            disabled={mounted ? Boolean(isLoading) : undefined}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </label>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={
            mounted ? Boolean(updateProfile.isPending || isLoading) : undefined
          }
          className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          {updateProfile.isPending ? "Saving…" : "Save changes"}
        </button>
      </section>

      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-red-600">Security</h2>
        <p className="mt-1 text-xs font-medium text-gray-500">
          Manage how you sign in.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Current password"
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={mounted ? Boolean(changePassword.isPending) : undefined}
          className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          {changePassword.isPending ? "Updating…" : "Change password"}
        </button>
      </section>
    </div>
  );
}
