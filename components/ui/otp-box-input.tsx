"use client";

import { useRef } from "react";

export interface OtpBoxInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpBoxInput({ length = 6, value, onChange, disabled }: OtpBoxInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Fill array to `length`
  const digits = value.split("").slice(0, length);
  while (digits.length < length) digits.push("");

  const focusAt = (index: number) => {
    inputRefs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        // Clear current cell
        const next = [...digits];
        next[index] = "";
        onChange(next.join(""));
      } else {
        // Move back and clear previous
        if (index > 0) {
          const next = [...digits];
          next[index - 1] = "";
          onChange(next.join(""));
          focusAt(index - 1);
        }
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const raw = e.target.value.replace(/\D/g, ""); // digits only
    if (!raw) return;
    const char = raw[raw.length - 1]; // only the last typed character
    const next = [...digits];
    next[index] = char;
    onChange(next.join(""));
    if (index < length - 1) focusAt(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = pasted.split("");
    while (next.length < length) next.push("");
    onChange(next.join(""));
    focusAt(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="flex items-center gap-2.5 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          id={`otp-box-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          autoComplete="one-time-code"
          className={`
            h-14 w-12 rounded-xl border-2 text-center text-xl font-bold
            text-gray-900 bg-white outline-none transition-all duration-150
            ${digit
              ? "border-green-500 bg-green-50/30 shadow-sm shadow-green-100"
              : "border-gray-200 hover:border-gray-300"
            }
            focus:border-green-600 focus:ring-2 focus:ring-green-600/20
            disabled:opacity-50 disabled:cursor-not-allowed
            caret-transparent
          `}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
