/**
 * OtpInput.tsx — 6-box OTP entry component.
 *
 * Auto-focuses next box, supports paste, backspace navigation.
 * Completely controlled — parent owns the value via onChange(code: string).
 */

import React, { useRef } from "react";
import clsx from "clsx";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return; // only digits

    const newDigits = [...digits];
    newDigits[index] = char;
    onChange(newDigits.join(""));

    // Move focus forward
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted.padEnd(length, "").slice(0, length));
    // Focus last filled box
    const lastIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[lastIndex]?.focus();
  };

  return (
    <div className="flex gap-2" role="group" aria-label="OTP input">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={clsx(
            "h-12 w-10 rounded-lg border text-center text-lg font-semibold outline-none",
            "transition-colors duration-150",
            "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
            error
              ? "border-red-400 text-red-600 focus:ring-red-100"
              : "border-gray-300 text-gray-800",
            disabled && "cursor-not-allowed bg-gray-50 opacity-60"
          )}
        />
      ))}
    </div>
  );
};
