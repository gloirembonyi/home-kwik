"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  Layout,
  Users,
  PlusCircle,
  Check,
  Search,
  Filter,
  AlertCircle,
  ChevronDown,
  BarChart2,
  Clock,
  Tag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/base/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/base/avatar";
import { Card, CardContent } from "@/components/ui/base/card";
import { Badge } from "@/components/ui/base/badge";
import { Alert, AlertDescription } from "@/components/ui/base/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/base/dropdown-menu";
import { Progress } from "@/components/ui/base/progress";
import { Input } from "../ui/Input";
import { Select } from "@/components/ui/base/select";
import TaskModal from "./task-model";
import SearchAndFilters from "./Search-Filters";

type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed';
type TaskPriority = 'Low' | 'Medium' | 'High';

interface StatusColors {
  [key: string]: string;
  Todo: string;
  "In Progress": string;
  Review: string;
  Completed: string;
}

interface PriorityColors {
  [key: string]: string;
  Low: string;
  Medium: string;
  High: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: string;
  status: TaskStatus;
  priority: TaskPriority;
  date: string;
  category: string;
  progress: number;
  team: string[];
  starred: boolean;
  tags: string[];
  subtasks: Subtask[];
}

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  viewMode: 'grid' | 'list';  // Define viewMode as literal type union
  setViewMode: (mode: 'grid' | 'list') => void;
  setShowModal: (show: boolean) => void;
  categories: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

const TaskBoard = () => {
  const initialCategories = [
    { id: "design", name: "Design", color: "bg-pink-100 text-pink-800" },
    {
      id: "development",
      name: "Development",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "marketing",
      name: "Marketing",
      color: "bg-purple-100 text-purple-800",
    },
    { id: "planning", name: "Planning", color: "bg-green-100 text-green-800" },
  ];

  const initialTasks = [
    {
      id: "1",
      icon: "🎨",
      title: "Website Redesign",
      description:
        "Redesign the main landing page with modern aesthetics and improved UX.",
      type: "Design",
      status: "In Progress",
      priority: "High",
      date: "2024-07-01",
      category: "design",
      progress: 65,
      team: ["sarah", "mike", "anna"],
      starred: true,
      tags: ["ui/ux", "web"],
      subtasks: [
        { id: "s1", title: "Wireframes", completed: true },
        { id: "s2", title: "Visual Design", completed: true },
        { id: "s3", title: "Prototyping", completed: false },
      ],
    },
    {
      id: "2",
      icon: "💻",
      title: "API Integration",
      description:
        "Integrate payment gateway API and implement error handling.",
      type: "Development",
      status: "Todo",
      priority: "Medium",
      date: "2024-07-15",
      category: "development",
      progress: 20,
      team: ["john", "emma"],
      starred: false,
      tags: ["backend", "api"],
      subtasks: [
        { id: "s1", title: "API Documentation Review", completed: true },
        { id: "s2", title: "Implementation", completed: false },
        { id: "s3", title: "Testing", completed: false },
      ],
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [categories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const statusColors: StatusColors = {
    Todo: "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Review: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
  };

  const priorityColors: PriorityColors = {
    Low: "bg-gray-100 text-gray-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  };

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    upcoming: tasks.filter((t) => t.status === "Todo").length,
    overdue: tasks.filter((t) => new Date(t.date) < new Date()).length,
  };

  const showNotification = (message: string, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleStar = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, starred: !task.starred } : task
      )
    );
    showNotification("Task starred status updated");
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    showNotification(`Task moved to ${newStatus}`);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    showNotification("Task deleted successfully", "warning");
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const progress = Math.round(
            (updatedSubtasks.filter((st) => st.completed).length /
              updatedSubtasks.length) *
              100
          );
          return { ...task, subtasks: updatedSubtasks, progress };
        }
        return task;
      })
    );
  };

  const addNewTask = (taskData: any) => {
    const newTask = {
      ...taskData,
      type: categories.find((cat) => cat.id === taskData.category)?.name || "",
      progress: 0,
      starred: false,
    };

    setTasks([newTask, ...tasks]);
    showNotification("New task added successfully");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || task.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sort tasks by starred status and date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.starred !== b.starred) return b.starred ? 1 : -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Alert Notification */}
      {showAlert && (
        <Alert
          className={`fixed top-4 right-4 w-72 transition-all duration-300 z-50 ${
            alertType === "error"
              ? "bg-red-50 text-red-800"
              : alertType === "warning"
              ? "bg-yellow-50 text-yellow-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <h3 className="text-2xl font-bold">{taskStats.total}</h3>
              </div>
              <BarChart2 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold">{taskStats.inProgress}</h3>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold">{taskStats.completed}</h3>
              </div>
              <Check className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <h3 className="text-2xl font-bold">{taskStats.upcoming}</h3>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <h3 className="text-2xl font-bold">{taskStats.overdue}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search and Filters */}
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setShowModal={setShowModal}
            categories={categories}
          />
        </div>
      </div>

      {/* Task Grid/List View */}
      <div
        className={`grid ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "grid-cols-1 gap-2"
        }`}
      >
        {sortedTasks.map((task) => (
          <Card
            key={task.id}
            className={`bg-white ${viewMode === "list" ? "p-4" : ""}`}
          >
            <CardContent className={`${viewMode === "grid" ? "p-6" : "p-0"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{task.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStar(task.id)}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        task.starred
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => updateTaskStatus(task.id, "Todo")}
                      >
                        Mark as Todo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateTaskStatus(task.id, "In Progress")}
                      >
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateTaskStatus(task.id, "Review")}
                      >
                        Mark as Review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateTaskStatus(task.id, "Completed")}
                      >
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600"
                      >
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={statusColors[task.status] || ''}>
                    {task.status}
                  </Badge>
                  <Badge className={priorityColors[task.priority] || ''}>
                    {task.priority}
                  </Badge>
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {task.team.map((member, index) => (
                      <Avatar key={index} className="border-2 border-white">
                        <AvatarFallback>
                          {member[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.date).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm font-medium">
                      {task.progress}%
                    </span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>

                {task.subtasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Subtasks</h4>
                    {task.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-2 text-sm"
                        onClick={() => toggleSubtask(task.id, subtask.id)}
                      >
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer
                          ${
                            subtask.completed
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {subtask.completed && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span
                          className={
                            subtask.completed
                              ? "line-through text-gray-500"
                              : ""
                          }
                        >
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Task Modal */}
      <TaskModal
        showModal={showModal}
        setShowModal={setShowModal}
        addNewTask={addNewTask}
        categories={categories}
      />
    </div>
  );
};

export default TaskBoard;
