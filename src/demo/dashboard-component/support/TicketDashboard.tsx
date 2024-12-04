"use client";

import React, { useState, useMemo } from 'react';
import { 
  AlarmClockOff, 
  CheckCircle2, 
  Clock, 
  FileQuestion, 
  MoreHorizontal, 
  RefreshCcw,
  Search,
  Filter,
  PlusCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/base/table";
import { Badge } from "@/components/ui/base/badge";
import { Button } from "@/components/ui/base/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/base/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/base/dropdown-menu";
import { Input } from '@/components/ui/Input';

// Ticket types
interface Ticket {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  subject: string;
  description: string;
  status: 'new' | 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdated: string;
  assignedTo?: string;
}

// Status and priority configurations
const STATUS_CONFIG = {
  new: { 
    label: 'New', 
    color: 'bg-blue-100 text-blue-800', 
    icon: <FileQuestion className="w-4 h-4 mr-2" /> 
  },
  open: { 
    label: 'Open', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: <Clock className="w-4 h-4 mr-2" /> 
  },
  pending: { 
    label: 'Pending', 
    color: 'bg-orange-100 text-orange-800', 
    icon: <RefreshCcw className="w-4 h-4 mr-2" /> 
  },
  resolved: { 
    label: 'Resolved', 
    color: 'bg-green-100 text-green-800', 
    icon: <CheckCircle2 className="w-4 h-4 mr-2" /> 
  },
  closed: { 
    label: 'Closed', 
    color: 'bg-gray-100 text-gray-800', 
    icon: <AlarmClockOff className="w-4 h-4 mr-2" /> 
  }
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800' }
};

const TicketDashboard: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Sample tickets with more detailed data
  const tickets: Ticket[] = [
    {
      id: 'TCK-001',
      customer: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      subject: 'Unable to complete ride payment',
      description: 'Payment gateway failing during checkout process',
      status: 'new',
      priority: 'high',
      createdAt: '2024-03-19T10:30:00',
      lastUpdated: '2024-03-19T10:30:00',
      assignedTo: 'Support Team'
    },
    {
      id: 'TCK-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com'
      },
      subject: 'App performance issues',
      description: 'App becomes slow after 10 minutes of use',
      status: 'open',
      priority: 'urgent',
      createdAt: '2024-03-18T14:45:00',
      lastUpdated: '2024-03-19T11:15:00',
      assignedTo: 'Engineering Team'
    }
  ];

  // Filtered and searched tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  // Status count summary
  const statusCounts = useMemo(() => {
    return tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<Ticket['status'], number>);
  }, [tickets]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Support Ticket Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage and track customer support tickets</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Create New Ticket
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <Card key={status} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                {config.icon}
                <CardTitle className="text-lg">{config.label}</CardTitle>
              </div>
              <CardDescription>
                {statusCounts[status as Ticket['status']] || 0} tickets
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Ticket List */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket List</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Input
                              placeholder="Search tickets..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 max-w-sm" id={''}              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 w-4 h-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 w-4 h-4" />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
                  <SelectItem key={priority} value={priority}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>{ticket.customer.name}</TooltipTrigger>
                        <TooltipContent>{ticket.customer.email}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_CONFIG[ticket.status].color}>
                      {STATUS_CONFIG[ticket.status].icon}
                      {STATUS_CONFIG[ticket.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={PRIORITY_CONFIG[ticket.priority].color}>
                      {PRIORITY_CONFIG[ticket.priority].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.assignedTo || 'Unassigned'}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Ticket</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tickets found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDashboard;