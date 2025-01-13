"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/base/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative group rounded-xl border-2  hover:border-primary/30"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200" />
      {theme === "dark" ? (
        <Moon className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
      ) : (
        <Sun className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
      )}
    </Button>
  );
}
