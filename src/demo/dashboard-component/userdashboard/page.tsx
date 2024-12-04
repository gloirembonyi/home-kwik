import React, { useState } from "react";
import { useRecoilState } from "recoil";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import { userToDeleteState, isDeleteModalOpen } from "@/atoms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/base/dropdown-menu";
import { Button } from "@/components/ui/base/button";
import { Checkbox } from "@/components/ui/base/checkbox";
import { Badge } from "@/components/ui/base/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/base/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  Activity,
  ArrowUpDown,
  Car,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  Star,
  Trash,
  TrendingUp,
  UserPlus,
  Users,
  Copy,
  Share,
  Archive,
  History,
  Eye,
  Flag,
  Lock,
} from "lucide-react";
import { IUserToDelete } from "@/types/@types";
import { Input } from "@/components/ui/Input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// mock data with more fields
const data: IUserToDelete[] = [
  {
    id: "m5gr84i9",
    names: "Ken Smith",
    usertype: "rider",
    email: "ken99@yahoo.com",
    status: "active",
    lastLogin: "2024-03-15T10:30:00",
    rating: 4.8,
    totalRides: 127,
    joinDate: "2023-08-15",
    phoneNumber: "+1 (555) 123-4567",
    completedRides: 120,
    cancelledRides: 7,
    totalSpent: 2450.75,
    preferredPayment: "credit_card",
    verificationStatus: "verified"
  },
  {
    id:  "derv1ws0",
    names: "Monserrat Brown",
    usertype: "driver",
    email: "Monserrat44@gmail.com",
    status: "active",
    lastLogin: "2024-04-28T15:43:00",
    rating: 3.8,
    totalRides: 98,
    joinDate: "2024-02-15",
    phoneNumber:  "+250 781 234567",
    completedRides: 123,
    cancelledRides: 7,
    totalSpent: 2450.75,
    preferredPayment: "credit_card",
    verificationStatus: "verified"
  },
  {
    id:   "5kma53ae",
    names: "Silas Davis",
    usertype: "driver",
    email: "Silas22@gmail.com",
    status: "inactive",
    lastLogin: "2024-08-28T15:23:00",
    rating: 3.6,
    totalRides: 230,
    joinDate: "2024-02-15",
    phoneNumber:  "+250 781 234567",
    completedRides: 132,
    cancelledRides: 7,
    totalSpent: 2450.75,
    preferredPayment: "credit_card",
    verificationStatus: "verified"
  },
  {
    id:    "bhqecj4p",
    names: "Carmella Wilson",
    usertype: "rider",
    email: "carmella@hotmail.com",
    status: "inactive",
    lastLogin: "2024-09-28T15:42:00",
    rating: 3.6,
    totalRides: 230,
    joinDate: "2024-03-15",
    phoneNumber:  "+250 781 234567",
    completedRides: 132,
    cancelledRides: 7,
    totalSpent: 2450.75,
    preferredPayment: "credit_card",
    verificationStatus: "verified"
  },

];


// New component for user activity trends
const UserActivityTrend = () => {
  const activityData = [
    { name: 'Jan', users: 65 },
    { name: 'Feb', users: 78 },
    { name: 'Mar', users: 95 },
    { name: 'Apr', users: 88 },
    { name: 'May', users: 102 }
  ];

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">User Activity Trends</CardTitle>
        <CardDescription>Monthly active users overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced StatsCards with animations and more metrics
const StatsCards = () => {
  const totalUsers = data.length;
  const activeUsers = data.filter(user => user.status === "active").length;
  const drivers = data.filter(user => user.usertype === "driver").length;
  const riders = data.filter(user => user.usertype === "rider").length;
  
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "blue",
      trend: "+12%",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: Activity,
      color: "green",
      trend: "+8%",
    },
    {
      title: "Drivers",
      value: drivers,
      icon: Car,
      color: "purple",
      trend: "+15%",
    },
    {
      title: "Riders",
      value: riders,
      icon: Users,
      color: "orange",
      trend: "+10%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </span>
                </div>
              </div>
              <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// column configurations with more features
export const columns: ColumnDef<IUserToDelete>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "names",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Names
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div>
          <div className="font-medium">{row.getValue("names")}</div>
          <div className="text-sm text-gray-500">{row.original.phoneNumber}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center">
          <div className="font-medium">{rating?.toFixed(1)}</div>
          <div className="ml-2 text-yellow-400">★</div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalRides",
    header: "Total Rides",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("totalRides")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "usertype",
    header: "User Type",
    cell: ({ row }) => {
      const usertype = row.getValue("usertype") as "rider" | "driver";
      return (
        <Badge
          variant={usertype === "driver" ? "default" : "secondary"}
          className="capitalize"
        >
          {usertype}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "active" | "inactive" | "suspended";
      const statusStyles = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        suspended: "bg-red-100 text-red-800",
      };

      return (
        <Badge
          variant="outline"
          className={`${statusStyles[status]} capitalize px-2 py-1`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastLogin"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "verificationStatus",
    header: "Verification",
    cell: ({ row }) => {
      const status = row.getValue("verificationStatus") as string;
      return (
        <Badge
          variant="outline"
          className={`${
            status === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          } capitalize`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [userToDelete, setUserToDelete] = useRecoilState(userToDeleteState);
      const [, setIsDeleteModalOpen] = useRecoilState(isDeleteModalOpen);
      const [isFavorite, setIsFavorite] = useState(false);
      const [isLocked, setIsLocked] = useState(false);

      // Sample action history - replace with your actual data
      const actionHistory = [
        { action: 'Profile Updated', timestamp: '2024-03-20 10:30' },
        { action: 'Status Changed', timestamp: '2024-03-19 15:45' },
        { action: 'Account Created', timestamp: '2024-03-18 09:15' },
      ];

      const handleDuplicate = () => {
        console.log('Duplicating:', row.original);
        // Implement your duplication logic here
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Quick Actions */}
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share className="mr-2 h-4 w-4" /> Share
            </DropdownMenuItem>

            {/* Toggleable States */}
            <DropdownMenuCheckboxItem
              checked={isFavorite}
              onCheckedChange={setIsFavorite}
            >
              <Star className="mr-2 h-4 w-4" /> Favorite
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isLocked}
              onCheckedChange={setIsLocked}
            >
              <Lock className="mr-2 h-4 w-4" /> Lock
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            {/* History Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <History className="mr-2 h-4 w-4" /> History
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                {actionHistory.map((record, index) => (
                  <DropdownMenuItem key={index}>
                    <div className="flex flex-col">
                      <span>{record.action}</span>
                      <span className="text-xs text-gray-500">{record.timestamp}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Additional Actions */}
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`/preview/${row.original.id}`, '_blank')}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Flag className="mr-2 h-4 w-4" /> Flag
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            {/* Danger Zone */}
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                setUserToDelete(row.original);
                setIsDeleteModalOpen(true);

              }}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const UserDashboard = () => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
  const [view, setView] = React.useState<"table" | "grid">("table");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExport = () => {
    // Implementation for exporting data
    console.log("Exporting data...");
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">User Dashboard</CardTitle>
              <CardDescription className="text-gray-500">
                Manage and monitor Kwik Ride user accounts efficiently
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className={`${isRefreshing ? "animate-spin" : ""}`}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StatsCards />
          <UserActivityTrend />
          
          {/* Enhanced toolbar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                                  placeholder="Search users..."
                                  value={globalFilter}
                                  onChange={(event) => setGlobalFilter(event.target.value)}
                                  className="pl-8 w-64 bg-white border-gray-200" id={""} type={""}                />
              </div>
              
              {/* Enhanced filters dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-2">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["Active", "Inactive", "Suspended"].map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={columnFilters.some(
                        filter =>
                          filter.id === "status" &&
                          filter.value === status.toLowerCase()
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setColumnFilters(prev => [...prev, { id: "status", value: status.toLowerCase() }]);
                        } else {
                          setColumnFilters(prev =>
                            prev.filter(
                              filter =>
                                !(filter.id === "status" && filter.value === status.toLowerCase())
                            )
                          );
                        }
                      }}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["Driver", "Rider"].map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={columnFilters.some(
                        filter =>
                          filter.id === "usertype" &&
                          filter.value === type.toLowerCase()
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setColumnFilters(prev => [...prev, { id: "usertype", value: type.toLowerCase() }]);
                        } else {
                          setColumnFilters(prev =>
                            prev.filter(
                              filter =>
                                !(filter.id === "usertype" && filter.value === type.toLowerCase())
                            )
                          );
                        }
                      }}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* pagination controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {table.getFilteredRowModel().rows.length} users
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 mx-2">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* we have table with hover effects and better styling */}
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-gray-600 font-semibold"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-500"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard