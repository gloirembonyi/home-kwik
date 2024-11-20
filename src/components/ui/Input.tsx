"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconType } from "react-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { BaseInput } from "./base/input";
import { Label } from "./base/label";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  Icon?: IconType | React.ComponentType<any>;
  hideToggle?: string;
  textColor?: string;
  Component?: React.ComponentType<{
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }>;
  className?: string;
}

export function Input({
  id,
  label,
  placeholder,
  type,
  Icon,
  value,
  onChange,
  hideToggle,
  textColor,
  Component,
  className,
  onFocus, // Added onFocus prop here
  onBlur, // Added onBlur prop here
  ...rest // Spread other input props
}: InputProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [toggleVisibility, setToggleVisibility] = useState(false);

  const showInput = hideToggle ? toggleVisibility : true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="grid w-full max-w-sm items-center gap-1.5"
      style={{
        color: textColor,
      }}
    >
      {label && (
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={id}>{label}</Label>
          {/* {hideToggle && (
            <div className="flex items-center gap-2">
              <Label htmlFor={hideToggle}>{hideToggle}</Label>
              <Switch
                id={hideToggle}
                checked={toggleVisibility}
                style={{ backgroundColor: textColor }}
                onCheckedChange={() => setToggleVisibility(!toggleVisibility)}
              />
            </div>
          )} */}
        </div>
      )}
      {showInput && !Component && (
        <div
          className={`flex items-center border-gray-300 ${
            Icon || type === "password" ? "border-b  px-2" : ""
          }`}
        >
          {Icon && <Icon className="mr-2" />}
          <BaseInput
            type={showPassword ? "text" : type}
            id={id}
            placeholder={label || placeholder}
            value={internalValue}
            onChange={handleChange}
            onFocus={onFocus} // Pass down onFocus
            onBlur={onBlur}   // Pass down onBlur
            className={cn(
              Icon || type === "password"
                ? "border-none focus-visible:outline-none focus:outline-none focus-visible:!ring-0"
                : "focus-visible:outline-none focus:outline-none focus-visible:!ring-0",
              "border-gray-300"
            )}
            {...rest} // Pass down other props
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
      )}
      {showInput && Component && <Component {...{ value: typeof value === "string" ? value : undefined, onChange }} />}

    </div>
  );
}
