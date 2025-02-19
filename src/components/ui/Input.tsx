"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconType } from "react-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { BaseInput } from "./base/input";
import { Label } from "./base/label";

import React, { useState } from "react";
import { cn } from "../lib/utils";
import { Switch } from "./base/switch";

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
  error?: string;
  hint?: string;
  disabled?: boolean;
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
  onFocus, 
  onBlur, 
  error,
  hint,
  disabled,
  ...rest
}: InputProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="grid w-full items-center gap-1.5">
      {label && (
        <div className="flex items-center justify-between gap-4">
          <Label
            htmlFor={id}
            className={cn(
              "text-sm font-medium text-foreground/80",
              disabled && "opacity-50"
            )}
          >
            {label}
          </Label>
          {hideToggle && (
            <div className="flex items-center gap-2">
              <Label
                htmlFor={hideToggle}
                className="text-sm font-medium text-muted-foreground"
              >
                {hideToggle}
              </Label>
              <Switch
                id={hideToggle}
                checked={toggleVisibility}
                onCheckedChange={() => setToggleVisibility(!toggleVisibility)}
                className={cn(
                  "data-[state=checked]:bg-primary",
                  disabled && "opacity-50"
                )}
              />
            </div>
          )}
        </div>
      )}
      {showInput && !Component && (
        <div className="relative">
          <div
            className={cn(
              "flex items-center rounded-lg border bg-background transition-colors",
              error
                ? "border-destructive focus-within:ring-destructive/30"
                : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
              disabled && "opacity-50 cursor-not-allowed",
              Icon || type === "password" ? "px-3 py-2" : "",
              className
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "h-5 w-5 mr-2 shrink-0",
                  error ? "text-destructive" : "text-muted-foreground"
                )}
              />
            )}
          <BaseInput
            type={showPassword ? "text" : type}
            id={id}
              placeholder={placeholder}
            value={internalValue}
            onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              disabled={disabled}
            className={cn(
                "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground",
                "border-0 focus-visible:outline-none focus:outline-none focus-visible:ring-0 focus:ring-0",
                "disabled:cursor-not-allowed",
                type === "password" && "pr-10"
              )}
              {...rest}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
                className={cn(
                  "absolute right-3 p-0.5 rounded-sm",
                  "text-muted-foreground hover:text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "transition-colors",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                disabled={disabled}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-4 w-4" />
                ) : (
                  <FaEye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          {(error || hint) && (
            <p
              className={cn(
                "mt-1.5 text-sm",
                error ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {error || hint}
            </p>
          )}
        </div>
      )}
      {showInput && Component && (
        <Component
          {...{
            value: typeof value === "string" ? value : undefined,
            onChange,
            disabled,
          }}
        />
      )}
    </div>
  );
}
