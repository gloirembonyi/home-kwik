import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { cn } from "@/components/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from './notification/hooks';
import { NotificationService } from './notification/notifications-service';



interface NotificationCount {
  count: number;
  severity: 'low' | 'medium' | 'high';
  lastUpdated: number;
  isRead?: boolean;
}

type NotificationsState = Record<string, NotificationCount>;

interface MenuItem {
  icon?: React.ReactElement;
  label: string;
  path: string;
  notifications?: NotificationCount;
  comingSoon?: boolean;
  subItems?: MenuItem[];
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  notificationUpdateInterval?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  onLogout,
  onCollapseChange,
  notificationUpdateInterval = 30000
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const notificationService = useMemo(() => NotificationService.getInstance(), []);
  const notifications = useNotifications();

  const handleCollapse = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  }, [isCollapsed, onCollapseChange]);

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdown(prev => prev === label ? null : label);
  }, []);

  const menuItems: MenuItem[] = useMemo(() => [
    { 
      icon: <LayoutDashboard />, 
      label: 'Dashboard', 
      path: '/dashboard',
      notifications: notifications['dashboard']
    },
    { 
      icon: <Users />, 
      label: 'Users', 
      path: '/all',
      notifications: notifications['users'],
      subItems: [
        { label: 'All Users', path: '/users' },
        { 
          label: 'Requests', 
          path: '/requests',
          notifications: notifications['requests']
        },
        { label: 'Suspension', path: '/suspension' },
        { 
          label: 'Logs', 
          path: '/logs', 
          notifications: notifications['logs']
        },
        { 
          label: 'Refunds', 
          path: '/refunds',
          notifications: notifications['refunds']
        },
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
    { icon: <TrendingUp />, label: 'Test', path: '/dash', badge: 2 },
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
  ], [notifications]);


   // Notification badge component with severity colors
   const NotificationBadge = React.memo(({ notification }: { notification?: NotificationCount }) => {
  if (!notification?.count) return null;

  const severityColorMap = {
    high: {
      base: 'bg-red-500',
      elevated: 'bg-red-600'
    },
    medium: {
      base: 'bg-yellow-500',
      elevated: 'bg-yellow-600'
    },
    low: {
      base: 'bg-blue-500',
      elevated: 'bg-blue-600'


      
    }
  };

  const { base, elevated } = severityColorMap[notification.severity];
  const color = notification.count > 5 ? elevated : base;

  return (
    <span className={cn(
      'ml-auto text-white text-xs font-bold rounded-full px-2 py-0.5',
      color,
      'animate-pulse'
    )}>
      {notification.count}
    </span>
  );
});

 
const handleNavigation = useCallback((path: string) => {
  console.log('Navigating to:', path); // Debug log
  onNavigate(path);
  
  // Check if there's a notification for this path
  const notification = notifications[path];
  if (notification && !notification.isRead) {
    console.log('Found unread notification for:', path); // Debug log
    notificationService.markAsRead(path);
  }
}, [notifications, onNavigate, notificationService]);

const renderMenuItem = useCallback((item: MenuItem) => {
  const isActive = currentPath === item.path;
  const isDropdownOpen = openDropdown === item.label;

  const handleItemClick = () => {
    if (item.subItems) {
      toggleDropdown(item.label);
    } else {
      handleNavigation(item.path);
    }
  };

  const handleSubItemClick = (subItem: MenuItem) => {
    handleNavigation(subItem.path);
  };
  
    return (
      <div key={item.path || item.label} className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleItemClick}
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
          {item.icon && (
            <span className="text-gray-600 group-hover:text-blue-700">
              {item.icon}
            </span>
          )}
          
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {item.label}
            </span>
          )}

          {!isCollapsed && item.subItems && (
            <span className="ml-auto">
              {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )}

          {!isCollapsed && item.notifications && !item.notifications.isRead && (
            <NotificationBadge notification={item.notifications} />
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
                  onClick={() => handleSubItemClick(subItem)}
                  className={cn(
                    'flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out px-4 py-2 gap-3 text-sm',
                    currentPath === subItem.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  )}
                >
                  {subItem.label}
                  {subItem.notifications && !subItem.notifications.isRead && (
                    <NotificationBadge notification={subItem.notifications} />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }, [currentPath, isCollapsed, openDropdown, toggleDropdown, handleNavigation]);

  

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

