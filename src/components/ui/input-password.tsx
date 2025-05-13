"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function InputPassword({ error, ...props }: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`w-full border ${error ? "border-red-500" : "border-neutral-300"} bg-transparent placeholder:text-neutral-500 focus:border-primary rounded-full h-12 px-4 py-3 pr-12`}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 focus:outline-none"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
