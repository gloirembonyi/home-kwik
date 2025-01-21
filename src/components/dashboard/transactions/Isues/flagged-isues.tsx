import React, { useState, useMemo } from "react";
import { Search, User, X, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/base/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import { cn } from "@/lib/utils";

// Initial issues data with more detailed information
const initialIssues = [
  {
    id: 1,
    title: "Check In Issue",
    description: "@Alexa shared a message regarding check in issue",
    time: "Just Now",
    avatar: null,
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    title: "Check In Issue",
    description: "@Alexa shared a message regarding check in issue",
    time: "11:16 AM",
    avatar: null,
    status: "in-progress",
    priority: "medium",
  },
  {
    id: 3,
    title: "Check In Issue",
    description: "@Alexa shared a message regarding check in issue",
    time: "09:00 AM",
    avatar: null,
    status: "pending",
    priority: "low",
  },
  {
    id: 4,
    title: "Robert Fox Feedback",
    description: '"It was an amazing experience with your organisation"',
    time: "Yesterday",
    avatar: null,
    status: "resolved",
    priority: "low",
  },
  {
    id: 5,
    title: "Password Update",
    description: "Your password has been updated successfully",
    time: "Yesterday",
    avatar: null,
    status: "resolved",
    priority: "low",
  },
];

const FlaggedIssuesPage: React.FC = () => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [issues, setIssues] = useState(initialIssues);

  // Filtering and searching logic
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filter === "all" || issue.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [issues, searchTerm, filter]);

  // Handle issue status change
  const updateIssueStatus = (id: number, newStatus: string) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus } : issue
      )
    );
  };

  // Remove issue
  const removeIssue = (id: number) => {
    setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
  };

  return (
    <main className="bg-background">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Flagged Issues
            </h1>
            <p className="text-sm text-muted-foreground">
              All issues provided by users
            </p>
          </div>
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative flex items-center">
                <input
                  type="search"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2.5 bg-background border border-input rounded-md
                    text-sm placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-colors duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Filter Dropdown */}
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter issues" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Issues</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-card rounded-lg shadow-md border border-border">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No issues found
            </div>
          ) : (
            filteredIssues.map((issue, index) => (
              <div
                key={issue.id}
                className={cn(
                  "flex items-center justify-between px-6 py-4",
                  index < filteredIssues.length - 1
                    ? "border-b border-border"
                    : "",
                  "hover:bg-accent/5"
                )}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Avatar or Placeholder */}
                  {issue.avatar ? (
                    <img
                      src={issue.avatar}
                      alt={issue.title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}

                  {/* Issue Details */}
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-foreground">
                        {issue.title}
                      </h3>
                      {/* Status Badge */}
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          {
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300":
                              issue.status === "pending",
                            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300":
                              issue.status === "in-progress",
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300":
                              issue.status === "resolved",
                          }
                        )}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {issue.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* Time */}
                  <span className="text-xs text-muted-foreground mr-4">
                    {issue.time}
                  </span>

                  {/* Status Change Buttons */}
                  {issue.status !== "resolved" && (
                    <Button
                      onClick={() => updateIssueStatus(issue.id, "resolved")}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-100/50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/50"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </Button>
                  )}

                  <Button
                    onClick={() => removeIssue(issue.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-100/50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default FlaggedIssuesPage;
