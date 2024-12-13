import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  Navigation,
  TrendingUp,
  Star,
  BarChart2,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from "@/components/lib/utils"
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  icon?: React.ReactElement;
  label: string;
  path: string;
  badge?: number;
  comingSoon?: boolean;
  subItems?: MenuItem[];
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  onLogout,
  onCollapseChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleCollapse = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  }, [isCollapsed, onCollapseChange]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard />, label: 'Dashboard', path: '/dashboard', badge: 3 },
    { 
      icon: <Users />, 
      label: 'Users', 
      path: '/all', 
      badge: 12, 
      subItems: [
        { label: 'All Users', path: '/users' },
        { label: 'Requests', path: '/requests' },
        { label: 'Suspension', path: '/suspension' },
        { label: 'Logs', path: '/logs' },
      ]
    },
    {
      icon: <Navigation />,
      label: 'Rides',
      path: '/rides',
      subItems: [
        { label: 'Ride Analytics', path: '/rides/analytics' },
        { label: 'Ride History', path: '/rides/history' },
        { label: 'Fleet', path: '/rides/fleet' }
      ]
    },
    { icon: <TrendingUp />, label: 'Revenue', path: '/revenue', badge: 2 },
    { 
      icon: <Star />,
      label: 'Transactions',
      path: '/ratings',
      subItems: [
        { label: 'All Transactions', path: '/transactions' },
        { label: 'Issues', path: '/issues' },
      ]
    },
    { icon: <BarChart2 />, label: 'Performance', path: '/performance' },
    { icon: <DollarSign />, label: 'Payment', path: '/cost' },
    { icon: <Settings />, label: 'Settings', path: '/settings' }
  ];

  const renderBadge = (count?: number) => {
    if (!count) return null;
    return (
      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
        {count}
      </span>
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActive = currentPath === item.path;
    const isDropdownOpen = openDropdown === item.label;

    return (
      <div key={item.path || item.label} className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() =>
            item.subItems ? toggleDropdown(item.label) : onNavigate(item.path)
          }
          className={cn(
            'group relative flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out',
            isCollapsed ? 'justify-center p-2' : 'px-4 py-3 gap-3',
            isActive
              ? 'bg-blue-100 text-blue-700 shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800',
            item.comingSoon && 'opacity-50 cursor-not-allowed'
          )}
          title={isCollapsed ? item.label : undefined}
        >
          <div
            className={cn(
              'transition-colors duration-200 relative flex items-center',
              isActive ? 'text-blue-800' : 'text-gray-500 group-hover:text-gray-700'
            )}
          >
            {item.icon &&
              React.cloneElement(item.icon, {
                size: 20,
                strokeWidth: isActive ? 2.5 : 1.5
              })}
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2"
              >
                <span className="font-medium whitespace-nowrap text-sm">
                  {item.label}
                </span>
                {renderBadge(item.badge)}
              </motion.div>
            )}
          </AnimatePresence>

          {!isCollapsed && item.subItems && (
            <div className="ml-auto">
              {isDropdownOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {isDropdownOpen && item.subItems && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-8 space-y-1 overflow-hidden"
            >
              {item.subItems.map((subItem) => (
                <div
                  key={subItem.path}
                  onClick={() => onNavigate(subItem.path)}
                  className={cn(
                    'flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out px-4 py-2 gap-3 text-sm',
                    currentPath === subItem.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  )}
                >
                  {subItem.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: 'tween', duration: 0.3 }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r shadow-lg z-40 overflow-hidden',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div
          className={cn(
            'px-6 py-6 border-b flex items-center transition-all duration-300',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="bg-blue-900 text-white w-10 h-9 rounded-full flex items-center justify-center font-bold text-xl shadow-md"
            >
              K
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="font-bold text-lg text-gray-800 tracking-wider"
                >
                  KWIK RIDE
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-2">{menuItems.map(renderMenuItem)}</div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t space-y-2">
          <div
            onClick={() => onNavigate('/help')}
            className={cn(
              'group flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out',
              isCollapsed ? 'justify-center p-2' : 'px-4 py-3 gap-3',
              'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            )}
          >
            <HelpCircle size={20} className="text-gray-500 group-hover:text-gray-700" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-sm"
                >
                  Help
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div
            onClick={onLogout || (() => signOut())}
            className={cn(
              'group flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out',
              isCollapsed ? 'justify-center p-2' : 'px-4 py-3 gap-3',
              'text-gray-600 hover:bg-red-50 hover:text-red-600'
            )}
          >
            <LogOut size={20} className="text-gray-500 group-hover:text-red-500" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-sm"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleCollapse}
            className={cn(
              'w-full flex items-center transition-all duration-300 ease-in-out rounded-lg',
              isCollapsed ? 'justify-center p-2' : 'justify-between px-4 py-2',
              'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            )}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <>
                <span className="text-sm">Collapse</span>
                <ChevronLeft size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;