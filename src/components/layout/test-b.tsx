// components/Sidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart3, Car, Users, Navigation, Shield,
  Bell, MessageSquare, Star, MessageCircle,
  ChevronDown, Menu, Gauge, UserCog, CarFront,
  ClipboardList, LogOut, Settings, Home
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/base/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/base/tooltip";
import { ScrollArea } from "@/components/ui/base/scroll-area";
import { Separator } from "@/components/ui/base/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/base/avatar";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  title: string;
  subItems: SubItem[];
}

interface SidebarProps {
  children?: React.ReactNode;
  onSidebarChange?: (isOpen: boolean) => void;
}

const Sidebar = ({ children, onSidebarChange }: SidebarProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (onSidebarChange) {
      onSidebarChange(isSidebarOpen);
    }
  }, [isSidebarOpen, onSidebarChange]);

  const toggleMenu = (key: string) => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <Home className="text-emerald-400" />,
      title: 'Dashboard',
      subItems: [
        { title: 'Overview', icon: <Home className="h-4 w-4" />, path: '/dashboard' },
        { title: 'Settings', icon: <Settings className="h-4 w-4" />, path: '/dashboard/settings' },
      ]
    },
    {
        key: 'analytics',
        icon: <BarChart3 className="text-blue-400" />,
        title: 'Analytics & Reports',
        subItems: [
          { title: 'Ride Statistics', icon: <Gauge className="h-4 w-4" />, path: '/analytics/rides' },
          { title: 'Driver Performance', icon: <UserCog className="h-4 w-4" />, path: '/components/SidebarPages/drivers' },
          { title: 'Growth Analysis', icon: <BarChart3 className="h-4 w-4" />, path: '/analytics/growth' },
        ]
      },
      {
        key: 'drivers',
        icon: <Users className="text-green-400" />,
        title: 'Driver Management',
        subItems: [
          { title: 'Driver Registration', icon: <UserCog className="h-4 w-4" />, path: '/drivers/register' },
          { title: 'Driver Profiles', icon: <Users className="h-4 w-4" />, path: '/drivers/profiles' },
          { title: 'Earnings Tracking', icon: <BarChart3 className="h-4 w-4" />, path: '/drivers/earnings' },
        ]
      },
      {
        key: 'vehicles',
        icon: <Car className="text-yellow-400" />,
        title: 'Vehicle Management',
        subItems: [
          { title: 'Vehicle Registry', icon: <CarFront className="h-4 w-4" />, path: '/vehicles/registry' },
          { title: 'Assignment', icon: <ClipboardList className="h-4 w-4" />, path: '/vehicles/assignment' },
        ]
      },
      {
        key: 'rides',
        icon: <Navigation className="text-purple-400" />,
        title: 'Ride Management',
        subItems: [
          { title: 'Ride Requests', icon: <ClipboardList className="h-4 w-4" />, path: '/rides/requests' },
          { title: 'Status Tracking', icon: <Gauge className="h-4 w-4" />, path: '/rides/status' },
        ]
      },
      {
        key: 'users',
        icon: <Users className="text-pink-400" />,
        title: 'User Management',
        subItems: [
          { title: 'User Profiles', icon: <Users className="h-4 w-4" />, path: '/users/profiles' },
          { title: 'Role Management', icon: <Shield className="h-4 w-4" />, path: '/users/roles' },
        ]
      },
      {
        key: 'security',
        icon: <Shield className="text-red-400" />,
        title: 'Security',
        subItems: [
          { title: 'Authentication', icon: <Shield className="h-4 w-4" />, path: '/security/auth' },
          { title: 'Access Control', icon: <UserCog className="h-4 w-4" />, path: '/security/access' },
        ]
      },
      {
        key: 'notifications',
        icon: <Bell className="text-amber-400" />,
        title: 'Notifications',
        subItems: [
          { title: 'Management', icon: <Bell className="h-4 w-4" />, path: '/notifications/manage' },
          { title: 'Test Notifications', icon: <MessageCircle className="h-4 w-4" />, path: '/notifications/test' },
        ]
      },
      {
        key: 'reviews',
        icon: <Star className="text-yellow-400" />,
        title: 'Reviews',
        subItems: [
          { title: 'Ride Reviews', icon: <Star className="h-4 w-4" />, path: '/reviews/rides' },
          { title: 'Driver Reviews', icon: <Star className="h-4 w-4" />, path: '/reviews/drivers' },
        ]
      },
      {
        key: 'sms',
        icon: <MessageSquare className="text-teal-400" />,
        title: 'SMS',
        subItems: [
          { title: 'Bulk SMS', icon: <MessageSquare className="h-4 w-4" />, path: '/sms/bulk' },
          { title: 'Individual SMS', icon: <MessageCircle className="h-4 w-4" />, path: '/sms/individual' },
        ]
      },
  ];

  const renderMenuItem = (item: MenuItem) => {
    const isAnySubItemActive = item.subItems.some(subItem => pathname === subItem.path);

    if (!isSidebarOpen) {
      return (
        <Tooltip key={item.key}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-center p-2 h-12",
                "hover:bg-gray-800/50 transition-colors duration-200",
                "relative overflow-hidden group"
              )}
            >
              {React.cloneElement(item.icon as React.ReactElement, {
                className: cn(
                  (item.icon as React.ReactElement).props.className,
                  "h-5 w-5 transition-transform group-hover:scale-110"
                )
              })}
              {isAnySubItemActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-l-full" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-900 text-white">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div key={item.key} className="space-y-1">
        <Button
          variant="ghost"
          onClick={() => toggleMenu(item.key)}
          className={cn(
            "w-full justify-between px-4 py-2 h-12",
            "hover:bg-gray-800/50 hover:text-gray-300 transition-colors",
            "group relative",
            expanded[item.key] && "bg-gray-800/50",
            isAnySubItemActive && "text-white"
          )}
        >
          <div className="flex items-center gap-3">
            {React.cloneElement(item.icon as React.ReactElement, {
              className: cn(
                (item.icon as React.ReactElement).props.className,
                "h-5 w-5 transition-transform group-hover:scale-110"
              )
            })}
            <span className="text-sm font-medium">{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              expanded[item.key] && "rotate-180"
            )}
          />
          {isAnySubItemActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
          )}
        </Button>

        {expanded[item.key] && (
          <div className="mt-1 space-y-1 animate-slideDown">
            {item.subItems.map((subItem, index) => (
              <Link key={`${item.key}-${index}`} href={subItem.path as any}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full pl-12 justify-start h-10",
                    "text-gray-400 hover:text-white hover:bg-gray-800/50",
                    "transition-colors duration-200",
                    pathname === subItem.path && "bg-gray-800/75 text-white"
                  )}
                >
                  <span className="mr-2">{subItem.icon}</span>
                  <span className="text-sm">{subItem.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50",
          "flex flex-col",
          "border-r border-gray-800 bg-gray-950 text-gray-400",
          "transition-all duration-300 ease-in-out",
          "shadow-2xl shadow-black/10",
          isSidebarOpen ? "w-64" : "w-16",
          isMobile && !isSidebarOpen && "transform -translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 bg-gray-900/50">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kwik Ride
            </h1>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  K
                </h1>
              </TooltipTrigger>
              <TooltipContent side="right">Kwik Ride</TooltipContent>
            </Tooltip>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-8 w-8 hover:bg-gray-500/50 transition-colors duration-200"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-gray-800" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-2">
          <nav className="space-y-1">
            {menuItems.map(renderMenuItem)}
          </nav>
        </ScrollArea>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
              <AvatarImage src="/avatar-placeholder.png" />
              <AvatarFallback className="bg-blue-500/20 text-blue-500">AD</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">admin@kwikride.com</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <Button
              variant="ghost"
              className="w-full mt-4 text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-16",
          "min-h-screen"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;