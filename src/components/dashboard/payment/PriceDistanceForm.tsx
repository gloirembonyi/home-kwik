"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/base/dialog";
import { toast } from "sonner";

interface FormData {
  tag: string;
  distance: string;
  amount: string;
  location: string;
  currency: string;
}

interface FormErrors {
  tag?: string;
  distance?: string;
  amount?: string;
  location?: string;
}

const PriceDistanceForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState<FormData>({
    tag: "",
    distance: "",
    amount: "0.00",
    location: "",
    currency: "RWF",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.tag) {
      newErrors.tag = "Tag is required";
    }

    if (!formData.distance) {
      newErrors.distance = "Distance is required";
    } else if (
      isNaN(Number(formData.distance)) ||
      Number(formData.distance) <= 0
    ) {
      newErrors.distance = "Please enter a valid distance";
    }

    if (!formData.amount || formData.amount === "0.00") {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "amount") {
      const numValue = value.replace(/[^0-9.]/g, "");
      const formattedValue = Number(numValue).toFixed(2);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Price and distance set successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to set price and distance. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="text-2xl font-bold text-gray-800">
          Set Distance and Price
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 px-1">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Tag <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="tag"
              className={`w-full px-4 py-2 text-gray-700 bg-white border ${
                errors.tag ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.tag}
              onChange={handleChange}
            >
              <option value="">Choose type of tag</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="premium">Premium</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {errors.tag && (
              <p className="text-red-500 text-xs mt-1">{errors.tag}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Distance <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="distance"
            placeholder="Add distance in km"
            className={`w-full px-4 py-2 text-gray-700 border ${
              errors.distance ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            value={formData.distance}
            onChange={handleChange}
          />
          {errors.distance ? (
            <p className="text-red-500 text-xs mt-1">{errors.distance}</p>
          ) : (
            <p className="text-xs text-gray-500">The number of kilometres</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="amount"
              className={`w-full pl-12 pr-24 py-2 text-gray-700 border ${
                errors.amount ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.amount}
              onChange={handleChange}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              {formData.currency}
            </div>
            <select
              name="currency"
              className="absolute right-0 top-0 bottom-0 w-20 px-2 text-gray-700 bg-gray-50 border-l border-gray-300 rounded-r-lg focus:outline-none"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="RWF">RWF</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="location"
              className={`w-full px-4 py-2 text-gray-700 bg-white border ${
                errors.location ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select location</option>
              <option value="kigali">Kigali</option>
              <option value="eastern">Eastern Province</option>
              <option value="western">Western Province</option>
              <option value="northern">Northern Province</option>
              <option value="southern">Southern Province</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium 
              ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              } 
              transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isSubmitting ? "Setting Price..." : "Set Price"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PriceDistanceForm;
