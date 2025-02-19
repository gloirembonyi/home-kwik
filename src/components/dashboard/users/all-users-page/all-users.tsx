"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronDown,
  Search,
  PlusCircle,
  Filter,
  Eye,
  Trash2,
  Edit2,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Menu,
  Download,
  Navigation,
} from "lucide-react";
import { SortConfig, FilterConfig } from "@/types/types";
import UserDetail from "./all-users-details";
import SMSDialog from "./SMS";
import ExportDialog from "./export-model";

export interface User {
  id: number;
  name: string;
  fullName?: string;
  userId: string;
  email: string;
  phoneNumber: string;
  phone?: string;
  role: string;
  gender: string;
  status: string;
  joinDate?: string;
  department?: string;
  country?: string;
  state?: string;
  address1?: string;
  address2?: string;
  profileImage?: string;
  roleSwitching?: boolean;
}
const UserManagement: React.FC = () => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailView, setIsDetailView] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const itemsPerPage = 5;

  //loading and fetch data
  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = () => {
      setTimeout(() => {
        setUsers([
          {
            id: 1,
            name: "Darlene Robertson",
            fullName: "Darlene Robertson",
            userId: "345321231",
            phoneNumber: "07820 242 525",
            phone: "+55 748 327 439",
            role: "Driver",
            gender: "Female",
            status: "Active",
            email: "darlene.robertson@example.com",
            joinDate: "2023-05-15",
            department: "Logistics",
            country: "USA",
            state: "California",
            address1: "Street John Wick, no. 7",
            address2: "House #25",
            profileImage: "",
            roleSwitching: false,
          },
          {
            id: 2,
            name: "Floyd Miles",
            fullName: "Floyd Miles",
            userId: "987890345",
            phoneNumber: "07820 242 526",
            phone: "+55 748 327 440",
            role: "Rider",
            gender: "Male",
            status: "Inactive",
            email: "floyd.miles@example.com",
            joinDate: "2023-02-20",
            country: "Canada",
            state: "Ontario",
            address1: "Tech Street, no. 15",
            address2: "Apartment #42",
            profileImage: "",
            roleSwitching: true,
          },
          {
            id: 3,
            name: "Eleanor Pena",
            fullName: "Floyd Miles",
            userId: "123456789",
            phoneNumber: "07820 242 527",
            phone: "+55 748 327 440",
            role: "Rider",
            gender: "Female",
            status: "Active",
            email: "eleanor.pena@example.com",
            joinDate: "2023-08-10",
            country: "Canada",
            state: "Ontario",
            address1: "Tech Street, no. 15",
            address2: "Apartment #42",
            profileImage: "",
            roleSwitching: true,
          },
          {
            id: 4,
            name: "Brooklyn Simmons",
            fullName: "Floyd Miles",
            userId: "456789123",
            phoneNumber: "07820 242 528",
            phone: "+55 748 327 440",
            role: "Driver",
            gender: "Female",
            status: "Pending",
            email: "brooklyn.simmons@example.com",
            joinDate: "2023-06-25",
            country: "Canada",
            state: "Ontario",
            address1: "Tech Street, no. 15",
            address2: "Apartment #42",
            profileImage: "",
            roleSwitching: true,
          },
          {
            id: 5,
            name: "Michael Chen",
            fullName: "Floyd Miles",
            userId: "654321987",
            phoneNumber: "07820 242 529",
            phone: "+55 748 327 440",
            role: "Driver",
            gender: "Male",
            status: "Active",
            email: "michael.chen@example.com",
            joinDate: "2023-09-05",
            country: "Canada",
            state: "Ontario",
            address1: "Tech Street, no. 15",
            address2: "Apartment #42",
            department: "Customer Service",
            profileImage: "",
            roleSwitching: true,
          },
        ]);
        setIsLoading(false);
      }, 2000); // 2-second delay
    };

    fetchUsers();
  }, []);

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId.includes(searchTerm) ||
        user.gender.toLowerCase().includes(searchTerm.toLowerCase());

      const roleMatch = !filterConfig.role || user.role === filterConfig.role;
      const statusMatch =
        !filterConfig.status || user.status === filterConfig.status;
      const genderMatch =
        !filterConfig.gender || user.gender === filterConfig.gender;

      return searchMatch && roleMatch && statusMatch && genderMatch;
    });
  }, [searchTerm, users, filterConfig]);

  // Add handler for SMS dialog
  const handleSendSMS = () => {
    if (selectedUsers.length > 0) {
      // Filter selected users data to pass to SMS dialog
      const selectedUsersData = users.filter((user) =>
        selectedUsers.includes(user.id)
      );
      setIsSMSDialogOpen(true);
    } else {
      // If no users selected, show all users
      setIsSMSDialogOpen(true);
    }
  };

  // Sorting Logic
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if ((a as any)[sortConfig.key!] < (b as any)[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if ((a as any)[sortConfig.key!] > (b as any)[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return sortedUsers.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, sortedUsers]);

  // Handlers
  const handleSort = useCallback(
    (key: keyof User) => {
      let direction: "ascending" | "descending" = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  const handleSelectUser = useCallback((userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleSelectAllUsers = useCallback(() => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user.id));
    }
  }, [selectedUsers, paginatedUsers]);

  // Utility Functions
  const getStatusColor = (status: User["status"]): string => {
    const statusColors: { [key in User["status"]]: string } = {
      Active: "bg-green-100 text-green-700",
      Inactive: "bg-red-100 text-red-700",
      Pending: "bg-yellow-100 text-yellow-700",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  };

  const getGenderIcon = (gender: string): string => {
    const genderIcons: { [key in User["gender"]]: string } = {
      Female: "♀",
      Male: "♂",
      "Not Specified": "—",
    };
    return genderIcons[gender] || "—";
  };

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Bulk Delete Handler
  const handleBulkDelete = useCallback(() => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !selectedUsers.includes(user.id))
    );
    setSelectedUsers([]);
  }, [selectedUsers]);

  // View User Handler
  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setCurrentView("detail");
  }, []);

  const handleSaveUser = useCallback((updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setCurrentView("list");
  }, []);

  // Delete User Handler
  const handleDeleteUser = useCallback((user: User) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    setCurrentView("list");
  }, []);

  // Skeleton Placeholder
  if (isLoading) {
    return (
      <div className="p-6 bg-background shadow-lg rounded-lg">
        <div className="animate-pulse">
          {/* Toolbar Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 bg-muted rounded w-2/3"></div>
            <div className="h-10 bg-muted rounded w-1/3"></div>
          </div>

          {/* Table Skeleton */}
          <div className="overflow-hidden border border-border rounded-lg">
            <div className="bg-muted p-4 flex items-center">
              <div className="h-5 bg-muted/50 rounded w-full"></div>
            </div>
            <div className="divide-y divide-border">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="p-4 flex items-center space-x-4">
                    <div className="h-10 w-10 bg-muted rounded-full"></div>
                    <div className="flex-grow">
                      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-1/6"></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto">
        {currentView === "list" ? (
          <>
            {/* Search and Filters */}
            <div className="bg-card shadow-lg rounded-xl p-4 md:p-6 mb-6 border border-border">
              {/* Mobile Menu Toggle */}
              <div className="md:hidden flex justify-end mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              <div className="flex space-x-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search users by name, email, ID, or gender"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-background border-2 border-input rounded-lg 
                    focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-foreground"
                  />
                  <Search className="absolute left-4 top-4 text-muted-foreground" />
                </div>
                {/* send sms to the user Button */}
                <button
                  onClick={handleSendSMS}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg 
                  flex items-center space-x-3 hover:bg-primary/90 transition 
                  shadow-md hover:shadow-lg"
                >
                  <Navigation className="w-6 h-6" />
                  <span className="font-semibold">Send SMS</span>
                </button>
                {/* Export Button */}
                <button
                  onClick={() => setIsExportDialogOpen(true)}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg 
                  flex items-center space-x-3 hover:bg-primary/90 transition 
                  shadow-md hover:shadow-lg"
                >
                  <Download className="w-6 h-6" />
                  <span className="font-semibold">Export</span>
                </button>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="bg-muted text-muted-foreground px-5 py-3 
                  rounded-lg flex items-center space-x-2 hover:bg-accent/50"
                >
                  <Filter className="w-6 h-6" />
                  <span>Filters</span>
                </button>
              </div>

              {/*Filters */}
              {isFilterOpen && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <select
                    value={filterConfig.role || ""}
                    onChange={(e) =>
                      setFilterConfig((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    className="p-2 bg-background border border-input rounded text-foreground"
                  >
                    <option value="">All Roles</option>
                    <option value="Driver">Driver</option>
                    <option value="Rider">Rider</option>
                  </select>

                  <select
                    value={filterConfig.status || ""}
                    onChange={(e) =>
                      setFilterConfig((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="p-2 bg-background border border-input rounded text-foreground"
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>

                  <select
                    value={filterConfig.gender || ""}
                    onChange={(e) =>
                      setFilterConfig((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="p-2 bg-background border border-input rounded text-foreground"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              )}
            </div>

            {/* User Table */}
            <div className="bg-card shadow-md rounded-lg overflow-x-auto border border-border">
              <table className="w-full hidden md:table">
                <thead className="bg-muted border-b border-border">
                  <tr className="transition-all duration-300">
                    <th className="p-4 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === paginatedUsers.length}
                        onChange={handleSelectAllUsers}
                        className="form-checkbox h-5 w-5 text-primary rounded border-input focus:ring-2 focus:ring-primary transition-all"
                      />
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      className="p-4 text-left cursor-pointer group hover:bg-accent/50 rounded-lg transition-all duration-300 ease-in-out"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          User Name
                        </span>
                        <ChevronDown className="ml-2 w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </th>
                    <th className="p-4 text-left font-medium text-muted-foreground">
                      User ID
                    </th>
                    <th className="p-4 text-left font-medium text-muted-foreground">
                      Phone Number
                    </th>
                    <th
                      onClick={() => handleSort("role")}
                      className="p-4 text-left cursor-pointer group hover:bg-accent/50 rounded-lg transition-all duration-300 ease-in-out"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          Role
                        </span>
                        <ChevronDown className="ml-2 w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("gender")}
                      className="p-4 text-left cursor-pointer group hover:bg-accent/50 rounded-lg transition-all duration-300 ease-in-out"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          Gender
                        </span>
                        <ChevronDown className="ml-2 w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="p-4 text-left cursor-pointer group hover:bg-accent/50 rounded-lg transition-all duration-300 ease-in-out"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          Status
                        </span>
                        <ChevronDown className="ml-2 w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </th>
                    <th className="p-4 text-left font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`${index % 2 === 0 ? "bg-card" : "bg-muted/5"} 
                  hover:bg-accent/5 transition`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="form-checkbox h-5 w-5 text-primary border-input"
                        />
                      </td>
                      <td className="p-4 flex items-center">
                        <div
                          className="w-10 h-10 rounded-full bg-primary/10 
                      flex items-center justify-center mr-3 text-primary"
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">{user.userId}</td>
                      <td className="p-4 text-foreground">
                        {user.phoneNumber}
                      </td>
                      <td className="p-4 text-foreground">{user.role}</td>
                      <td className="p-4">
                        <span className="flex items-center text-foreground">
                          <span className="mr-2">
                            {getGenderIcon(user.gender)}
                          </span>
                          {user.gender}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      {/* Action Buttons in User Rows */}
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center p-4 bg-muted border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of{" "}
                  {sortedUsers.length} records
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-input rounded-lg hover:bg-accent/50 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(0, 3)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "border border-input hover:bg-accent/50 text-foreground"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-input rounded-lg hover:bg-accent/50 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-foreground"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : selectedUser ? (
          <UserDetail
            user={selectedUser}
            onClose={() => setCurrentView("list")}
            onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            initialEditMode={false}
          />
        ) : null}
      </div>
      {/* Bulk Delete Button */}
      {selectedUsers.length > 0 && (
        <button
          onClick={handleBulkDelete}
          className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90 flex items-center"
        >
          <Trash2 className="mr-2" /> Delete {selectedUsers.length} Users
        </button>
      )}

      {/* Add SMS Dialog */}
      <SMSDialog
        isOpen={isSMSDialogOpen}
        onClose={() => setIsSMSDialogOpen(false)}
        users={users}
      />

      {/* ExportDialog component */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        users={users}
        selectedUsers={selectedUsers}
      />
    </div>
  );
};

export default UserManagement;
