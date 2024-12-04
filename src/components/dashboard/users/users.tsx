import React, { useState, useMemo, useCallback } from "react";
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
} from "lucide-react";
import { FilterConfig, SortConfig, User } from "@/types/types";


const UserManagement: React.FC = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);


  // Extended Mock Users Data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Darlene Robertson",
      userId: "345321231",
      phoneNumber: "07820 242 525",
      role: "Driver",
      gender: "Female",
      status: "Active",
      email: "darlene.robertson@example.com",
      joinDate: "2023-05-15",
      department: "Logistics",
    },
    {
      id: 2,
      name: "Floyd Miles",
      userId: "987890345",
      phoneNumber: "07820 242 526",
      role: "Rider",
      gender: "Male",
      status: "Inactive",
      email: "floyd.miles@example.com",
      joinDate: "2023-02-20",
    },
    {
      id: 3,
      name: "Eleanor Pena",
      userId: "123456789",
      phoneNumber: "07820 242 527",
      role: "Rider",
      gender: "Female",
      status: "Active",
      email: "eleanor.pena@example.com",
      joinDate: "2023-08-10",
    },
    {
      id: 4,
      name: "Brooklyn Simmons",
      userId: "456789123",
      phoneNumber: "07820 242 528",
      role: "Driver",
      gender: "Female",
      status: "Pending",
      email: "brooklyn.simmons@example.com",
      joinDate: "2023-06-25",
    },
    {
      id: 5,
      name: "Michael Chen",
      userId: "654321987",
      phoneNumber: "07820 242 529",
      role: "Driver",
      gender: "Male",
      status: "Active",
      email: "michael.chen@example.com",
      joinDate: "2023-09-05",
      department: "Customer Service",
    },
  ]);

  const itemsPerPage = 5;

  // Advanced Filtering
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
  const getStatusColor = (status: User['status']): string => {
    const statusColors: { [key in User['status']]: string } = {
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

  // View User Handler
  const handleViewUser = useCallback((user: User) => {
    setCurrentUser(user);
    setIsViewUserModalOpen(true);
  }, []);

  // Edit User Handler
  const handleEditUser = useCallback((user: User) => {
    setCurrentUser(user);
    setIsEditUserModalOpen(true);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
    });
  }, []);

  const handleUpdateUser = useCallback(() => {
    if (currentUser && newUser.name && newUser.email && newUser.role) {
      setUsers((prevUsers: User[]) =>
        prevUsers.map((user) =>
          user.id === currentUser.id
            ? {
                ...user,
                name: newUser.name || user.name, 
                email: newUser.email || user.email, 
                role: newUser.role || user.role, 
                phoneNumber: newUser.phoneNumber || user.phoneNumber, 
                gender: newUser.gender || user.gender, 
              }
            : user
        )
      );
      setIsEditUserModalOpen(false);
      setNewUser({});
      setCurrentUser(null);
    }
  }, [currentUser, newUser]);
  

  const handleAddUser = useCallback(() => {
    // Validate all required fields
    if (!newUser.name || !newUser.email || !newUser.role || 
        !newUser.phoneNumber || !newUser.gender) {
      alert("Please fill in all required fields");
      return;
    }

    const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const completeUser: User = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      userId: `USER-${newUserId}`,
      phoneNumber: newUser.phoneNumber,
      gender: newUser.gender,
      status: "Pending", // Default status
      joinDate: new Date().toISOString().split("T")[0],
    };

    setUsers((prevUsers: User[]) => [...prevUsers, completeUser]);
    setNewUser({});
    setIsAddUserModalOpen(false);
  }, [newUser, users]);

  // Enhanced Delete User with Confirmation
  const confirmDeleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmModalOpen(true);
  }, []);

  const handleDeleteUser = useCallback(() => {
    if (userToDelete) {
      setUsers((prevUsers: User[]) => 
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );
      setIsDeleteConfirmModalOpen(false);
      setUserToDelete(null);
    }
  }, [userToDelete]);

  const handleCancelAddUser = useCallback(() => {
    setNewUser({});
    setIsAddUserModalOpen(false);
  }, []);

  // Bulk Delete Handler
  const handleBulkDelete = useCallback(() => {
    setUsers(prevUsers => 
      prevUsers.filter(user => !selectedUsers.includes(user.id))
    );
    setSelectedUsers([]);
  }, [selectedUsers]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}

        {/* Search and Filters */}
        <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 mb-6">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex justify-end mb-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600"
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
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Search className="absolute left-4 top-4 text-gray-400" />
            </div>
             {/* Add New User Button */}
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg 
            flex items-center space-x-3 hover:bg-blue-700 transition 
            shadow-md hover:shadow-lg"
        >
          <PlusCircle className="w-6 h-6" />
          <span className="font-semibold">Add New User</span>
        </button>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-gray-100 text-gray-700 px-5 py-3 
                  rounded-lg flex items-center space-x-2 hover:bg-gray-200"
            >
              <Filter className="w-6 h-6" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {isFilterOpen && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <select
                value={filterConfig.role || ""}
                onChange={(e) =>
                  setFilterConfig((prev) => ({ ...prev, role: e.target.value }))
                }
                className="p-2 border rounded"
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
                className="p-2 border rounded"
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
                className="p-2 border rounded"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          )}
        </div>



        {/* User Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full hidden md:table">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 shadow-sm">
              <tr className="transition-all duration-300">
                <th className="p-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length}
                    onChange={handleSelectAllUsers}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="p-4 text-left cursor-pointer group hover:bg-blue-100 rounded-lg transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 group-hover:text-blue-800 transition-colors">
                      User Name
                    </span>
                    <ChevronDown className="ml-2 w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </th>
                <th className="p-4 text-left font-medium text-gray-600">
                  User ID
                </th>
                <th className="p-4 text-left font-medium text-gray-600">
                  Phone Number
                </th>
                <th
                  onClick={() => handleSort("role")}
                  className="p-4 text-left cursor-pointer group hover:bg-blue-100 rounded-lg transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 group-hover:text-blue-800 transition-colors">
                      Role
                    </span>
                    <ChevronDown className="ml-2 w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("gender")}
                  className="p-4 text-left cursor-pointer group hover:bg-blue-100 rounded-lg transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 group-hover:text-blue-800 transition-colors">
                      Gender
                    </span>
                    <ChevronDown className="ml-2 w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="p-4 text-left cursor-pointer group hover:bg-blue-100 rounded-lg transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 group-hover:text-blue-800 transition-colors">
                      Status
                    </span>
                    <ChevronDown className="ml-2 w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </th>
                <th className="p-4 text-left font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
                  hover:bg-blue-50 transition`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="p-4 flex items-center">
                    <div
                      className="w-10 h-10 rounded-full bg-blue-200 
                      flex items-center justify-center mr-3 text-blue-800"
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4">{user.userId}</td>
                  <td className="p-4">{user.phoneNumber}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span className="flex items-center">
                      <span className="mr-2">{getGenderIcon(user.gender)}</span>
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
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleEditUser(user)}
            className="text-green-600 hover:text-green-800"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button 
        onClick={() => confirmDeleteUser(user)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 className="w-5 h-5" />
      </button>                                                                                                                                                                                                                      
        </td>
                </tr>
              ))}
            </tbody>
          </table>

           {/* Mobile Table View */}
           <div className="md:hidden">
            {paginatedUsers.map((user) => (
              <div 
                key={user.id} 
                className="border-b p-4 flex flex-col space-y-2 hover:bg-blue-50"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-3 text-blue-800">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">User ID:</div>
                  <div>{user.userId}</div>
                  <div className="text-gray-600">Phone:</div>
                  <div>{user.phoneNumber}</div>
                  <div className="text-gray-600">Role:</div>
                  <div>{user.role}</div>
                  <div className="text-gray-600">Gender:</div>
                  <div>{user.gender}</div>
                  <div className="text-gray-600">Status:</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 bg-gray-100">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of{" "}
              {sortedUsers.length} records
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-200 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                        ? "bg-blue-600 text-white"
                        : "border hover:bg-gray-200"
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
                className="px-3 py-1 border rounded-lg hover:bg-gray-200 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add User Modal - Enhanced */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-6">Add New User</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={newUser.name || ""}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={newUser.email || ""}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={newUser.phoneNumber || ""}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                className="w-full p-3 border rounded"
                required
              />
              <select
                value={newUser.role || ""}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full p-3 border rounded"
                required
              >
                <option value="">Select Role *</option>
                <option value="Driver">Driver</option>
                <option value="Rider">Rider</option>
              </select>
              <select
                value={newUser.gender || ""}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="w-full p-3 border rounded"
                required
              >
                <option value="">Select Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Not Specified">Not Specified</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
                >
                  <X className="mr-2" /> Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                >
                  <Check className="mr-2" /> Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Confirm Delete</h2>
            <div className="mb-4">
              <p>Are you sure you want to delete the following user?</p>
              <div className="mt-4 bg-gray-100 p-4 rounded">
                <p><strong>Name:</strong> {userToDelete.name}</p>
                <p><strong>Email:</strong> {userToDelete.email}</p>
                <p><strong>User ID:</strong> {userToDelete.userId}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteConfirmModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
              >
                <X className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              >
                <Trash2 className="mr-2" /> Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
       {/* View User Modal */}
       {isViewUserModalOpen && currentUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-6">User Details</h2>
              <div className="space-y-4">
                <div><strong>Name:</strong> {currentUser.name}</div>
                <div><strong>Email:</strong> {currentUser.email}</div>
                <div><strong>User ID:</strong> {currentUser.userId}</div>
                <div><strong>Role:</strong> {currentUser.role}</div>
                <div><strong>Phone:</strong> {currentUser.phoneNumber}</div>
                <div><strong>Gender:</strong> {currentUser.gender}</div>
                <div><strong>Status:</strong> {currentUser.status}</div>
                <div><strong>Join Date:</strong> {currentUser.joinDate}</div>
                {currentUser.department && (
                  <div><strong>Department:</strong> {currentUser.department}</div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsViewUserModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
                  >
                    <X className="mr-2" /> Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

       {/* Edit User Modal */}
       {isEditUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-6">Edit User</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-3 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full p-3 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newUser.phoneNumber || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, phoneNumber: e.target.value }))
                  }
                  className="w-full p-3 border rounded"
                />
                <select
                  value={newUser.role || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full p-3 border rounded"
                >
                  <option value="">Select Role</option>
                  <option value="Driver">Driver</option>
                  <option value="Rider">Rider</option>
                </select>
                <select
                  value={newUser.gender || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="w-full p-3 border rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEditUserModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
                  >
                    <X className="mr-2" /> Cancel
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    <Check className="mr-2" /> Update User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

       {/* Optional: Bulk Delete Button */}
       {selectedUsers.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
          >
            <Trash2 className="mr-2" /> Delete {selectedUsers.length} Users
          </button>
        )}
    </div>
  );
};

export default UserManagement;
