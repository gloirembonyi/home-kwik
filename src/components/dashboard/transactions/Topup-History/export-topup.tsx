import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/base/dialog";
import { Transaction } from "./topup";

interface ExportTopupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  selectedTransactions?: string[];
}

const ExportTopupDialog: React.FC<ExportTopupDialogProps> = ({
  isOpen,
  onClose,
  transactions,
  selectedTransactions = [],
}) => {
  const [selectedFields, setSelectedFields] = useState([
    "Date stamp",
    "Mobile Number",
    "Amount",
  ]);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const fieldButtonRef = useRef<HTMLDivElement | null>(null);

  const availableFields = [
    "Date stamp",
    "Mobile Number",
    "User",
    "Amount",
    "Status",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !fieldButtonRef.current?.contains(target)
      ) {
        setIsFieldDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleExport = () => {
    const transactionsToExport =
      selectedTransactions.length > 0
        ? transactions.filter((transaction) =>
            selectedTransactions.includes(transaction.id)
          )
        : transactions;

    const fieldMapping: { [key: string]: keyof Transaction } = {
      "Date stamp": "timestamp",
      "Mobile Number": "mobileNumber",
      User: "user",
      Amount: "amount",
      Status: "status",
    };

    const headers = selectedFields.join(",");
    const rows = transactionsToExport.map((transaction) =>
      selectedFields
        .map((field) => {
          const key = fieldMapping[field];
          return `"${transaction[key]}"`;
        })
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "topup_transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-3xl p-8 bg-card border border-border">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Export Transactions
          </h2>
          <p className="text-muted-foreground text-lg">
            Do you want to export the selected transactions to a .csv file?
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-lg font-medium text-foreground">Fields</label>
          <div className="p-4 border border-border rounded-xl bg-background">
            <div className="flex flex-wrap gap-2">
              {selectedFields.map((field) => (
                <div
                  key={field}
                  className="flex items-center bg-accent rounded-full px-4 py-2"
                >
                  <span className="text-foreground">{field}</span>
                  <button
                    onClick={() => handleFieldToggle(field)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="relative" ref={fieldButtonRef}>
                <button
                  onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg 
                  hover:bg-accent text-foreground"
                >
                  <span>Field</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isFieldDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg"
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                      right: 0,
                    }}
                  >
                    {availableFields.map((field) => (
                      <button
                        key={field}
                        onClick={() => {
                          handleFieldToggle(field);
                          setIsFieldDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 hover:bg-accent text-foreground 
                        disabled:text-muted-foreground"
                        disabled={selectedFields.includes(field)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{field}</span>
                          {selectedFields.includes(field) && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 border border-border rounded-xl hover:bg-accent 
            text-foreground font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl 
            hover:bg-primary/90 font-medium transition-colors"
          >
            Export Now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportTopupDialog;
