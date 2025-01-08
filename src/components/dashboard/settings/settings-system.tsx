import React, { useState, useEffect } from 'react';
import { 
  Bell, Settings2, Shield, Globe, Moon, Sun, Monitor, Mail, 
 BellRing, Lock, Key, Smartphone, History, Activity,
  Eye, EyeOff, Keyboard, Languages, Pin, Palette, Database,
  LayoutGrid, Radio, Wifi, Battery, Volume2, Computer, Tablet,
  LogOut, Trash2,
  Network,
  User, 
} from 'lucide-react';
import { Switch } from "@/components/ui/base/switch";
import { Button } from "@/components/ui/base/button";
import { Label } from "@/components/ui/base/label";
import { Progress } from "@/components/ui/base/progress";
import { Separator } from "@/components/ui/base/separator";
import { Badge } from "@/components/ui/base/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/base/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/base/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/base/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/base/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/base/tooltip";
import ProfileTab from './profile';
import { AuditLog, DEFAULT_NOTIFICATION_SETTINGS, Device, SystemResource, UserData } from '@/types/settings-user';




const SettingSystem = () => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);
const [userData, setUserData] = useState<UserData>({
    id: "usr_123456",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    state: "California",
    address1: "123 Main Street",
    address2: "Apt 4B",
    profileImage: "",
    roleSwitching: false,
    twoFactorAuth: false,
    privacyLevel: "medium",
    accountCreated: new Date("2023-01-15"),
    lastLogin: new Date(),
    passwordLastChanged: new Date("2023-12-01"),
    failedLoginAttempts: 0,
    loginHistory: [
      {
        timestamp: new Date(),
        ipAddress: "192.168.1.1",
        deviceInfo: "Chrome on Windows",
        location: "San Francisco, CA",
        status: "success",
      },
    ],
    deviceHistory: [
      {
        id: "dev_1",
        deviceName: "Windows PC",
        browser: "Chrome",
        os: "Windows 11",
        lastActive: new Date(),
        isCurrent: true,
      },
    ],
    notifications: DEFAULT_NOTIFICATION_SETTINGS,
  });

  const [activeDevices, setActiveDevices] = useState<Device[]>([
    { id: 1, name: 'MacBook Pro', type: 'computer', lastActive: 'Now', isCurrentDevice: true },
    { id: 2, name: 'iPhone 13', type: 'mobile', lastActive: '2 hours ago' },
    { id: 3, name: 'iPad Pro', type: 'tablet', lastActive: '1 day ago' }
  ]);

  const [systemResources, setSystemResources] = useState<SystemResource[]>([
    {
        name: 'CPU Usage', usage: 45, limit: 100, status: 'good',
        trend: 'up',
        history: []
    },
    {
        name: 'Memory', usage: 6.2, limit: 16, status: 'warning',
        trend: 'up',
        history: []
    },
    {
        name: 'Storage', usage: 234, limit: 512, status: 'good',
        trend: 'up',
        history: []
    }
  ]);

  const [preferences, setPreferences] = useState({
    animations: true,
    soundEffects: true,
    autoUpdate: true,
    deviceSync: true,
    analytics: false,
    betaFeatures: false,
    twoFactorAuth: true,
    passwordlessLogin: false,
    rememberDevices: true,
    dataCollection: false
  });

  const [performance, setPerformance] = useState<'balanced' | 'performance' | 'battery'>('balanced');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorScheme, setColorScheme] = useState<string>('blue');
  const [systemStatus, setSystemStatus] = useState<'operational' | 'degraded' | 'maintenance'>('operational');

  // New states for privacy & security
  const [lastPasswordChange, setLastPasswordChange] = useState<string>('2 months ago');
  const [securityAlerts, setSecurityAlerts] = useState([
    { id: 1, type: 'info', message: 'Last security scan: 2 days ago' },
    { id: 2, type: 'warning', message: 'Password change recommended' }
  ]);

  // Handler functions
  const handleDeviceRemoval = (deviceId: number) => {
    setActiveDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  const handleLogoutDevice = (deviceId: number) => {
    // In a real app, you'd call an API here
    console.log(`Logging out device ${deviceId}`);
    setActiveDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, lastActive: 'Logged out' }
          : device
      )
    );
  };

   const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 1,
      action: 'Security Policy Update',
      user: 'admin@example.com',
      timestamp: '2024-01-03 14:30',
      details: 'Modified password requirements',
      severity: 'high'
    }
  ]);

  const [networkConfig, setNetworkConfig] = useState({
    vpnEnabled: true,
    firewallStatus: 'active',
    bandwidth: { upload: 50, download: 100 },
    activeConnections: 24
  });

  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    frequency: 'daily',
    lastBackup: '2024-01-02 23:00',
    backupLocation: 'cloud',
    retentionDays: 30
  });

  return (
    <div className="min-h-screen bg-background p-6 -m-4 -mt-6">


      {/* Main Content */}
      <Tabs defaultValue="personalization" className="max-w-6xl mx-auto">
        <TabsList className="mb-4 flex gap-2 p-1 bg-muted rounded-lg">
          <TabsTrigger value="personalization" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Personalization
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Computer className="w-4 h-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Privacy & Security
          </TabsTrigger>

          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="profile">
          <User className="w-4 h-4 mr-2" />
            Profile
            </TabsTrigger>
        </TabsList>

        {/* Personalization Tab */}
        <TabsContent value="personalization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pin className="w-5 h-5" />
                Visual Preferences
              </CardTitle>
              <CardDescription>Customize the appearance of your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection with Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Color Scheme</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['blue', 'purple', 'green', 'orange', 'red', 'pink', 'gray', 'custom'].map((color) => (
                      <TooltipProvider key={color}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                                colorScheme === color ? 'border-primary' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color === 'custom' ? '#gradient' : color }}
                              onClick={() => setColorScheme(color)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">{color}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Font Size</Label>
                  <Select value={fontSize} onValueChange={(value: 'small' | 'medium' | 'large') => setFontSize(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Advanced Animation Settings */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="animations">
                  <AccordionTrigger>Animation Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>UI Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                        </div>
                        <Switch
                          checked={preferences.animations}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({...prev, animations: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Sound Effects</Label>
                          <p className="text-sm text-muted-foreground">Play sound effects for interactions</p>
                        </div>
                        <Switch
                          checked={preferences.soundEffects}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({...prev, soundEffects: checked}))}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Visual Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Layout & Display</CardTitle>
              <CardDescription>Configure your workspace layout and display settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Layout Density</Label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Menu Animation</Label>
                  <Select defaultValue="slide">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Status</CardTitle>
                <Badge 
                  variant={
                    systemStatus === 'operational' ? 'default' :
                    systemStatus === 'degraded' ? 'secondary' :
                    'destructive'
                  }
                >
                  {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
                </Badge>
              </div>
              <CardDescription>Monitor system resources and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* System Resources */}
              <div className="space-y-4">
                {systemResources.map((resource) => (
                  <div key={resource.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{resource.name}</span>
                      <span className="text-muted-foreground">
                        {resource.usage}/{resource.limit} 
                        {resource.name === 'Memory' ? 'GB' : resource.name === 'Storage' ? 'GB' : '%'}
                      </span>
                    </div>
                    <Progress 
                      value={(resource.usage / resource.limit) * 100}
                      className={
                        resource.status === 'good' ? 'text-green-500' :
                        resource.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Performance Mode */}
              <div className="space-y-4">
                <Label>Performance Mode</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'battery', icon: Battery, label: 'Battery Saver' },
                    { value: 'balanced', icon: Activity, label: 'Balanced' },
                    { value: 'performance', icon: Settings2, label: 'Performance' },
                  ].map(({ value, icon: Icon, label }) => (
                    <Button
                      key={value}
                      variant={performance === value ? 'default' : 'outline'}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                      onClick={() => setPerformance(value as typeof performance)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Manage system updates and maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatic Updates</Label>
                    <p className="text-sm text-muted-foreground">Keep your system up to date automatically</p>
                  </div>
                  <Switch
                    checked={preferences.autoUpdate}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({...prev, autoUpdate: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Beta Features</Label>
                    <p className="text-sm text-muted-foreground">Get early access to new features</p>
                  </div>
                  <Switch
                    checked={preferences.betaFeatures}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({...prev, betaFeatures: checked}))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices Tab - Completed */}
        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>Manage your connected devices and sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    {device.type === 'computer' && <Computer className="w-5 h-5" />}
                    {device.type === 'mobile' && <Smartphone className="w-5 h-5" />}
                    {device.type === 'tablet' && <Tablet className="w-5 h-5" />}
                    <div>
                      <p className="font-medium">
                        {device.name}
                        {device.isCurrentDevice && (
                          <Badge variant="secondary" className="ml-2">Current Device</Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Last active: {device.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLogoutDevice(device.id)}
                      disabled={device.isCurrentDevice}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeviceRemoval(device.id)}
                      disabled={device.isCurrentDevice}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="space-y-1">
                  <Label>Remember Devices</Label>
                  <p className="text-sm text-muted-foreground">Stay signed in on trusted devices</p>
                </div>
                <Switch
                  checked={preferences.rememberDevices}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({...prev, rememberDevices: checked}))}
                />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Privacy & Security Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Alerts */}
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <Alert key={alert.id} variant={alert.type === 'warning' ? 'destructive' : 'default'}>
                    <Shield className="w-4 h-4" />
                    <AlertTitle>Security Alert</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Alert>
                ))}
              </div>

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={preferences.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({...prev, twoFactorAuth: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Passwordless Login</Label>
                    <p className="text-sm text-muted-foreground">Use biometrics or security keys</p>
                  </div>
                  <Switch
                    checked={preferences.passwordlessLogin}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({...prev, passwordlessLogin: checked}))}
                  />
                </div>
              </div>

              {/* Password Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">Last changed: {lastPasswordChange}</p>
                  </div>
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Preferences</CardTitle>
              <CardDescription>Control how your data is collected and used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Data Collection</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
                  </div>
                  <Switch
                    checked={preferences.dataCollection}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({...prev, dataCollection: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve our products</p>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({...prev, analytics: checked}))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data Management</h4>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> {/* New Monitoring Tab */}
        <TabsContent value="monitor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Diagnostics</CardTitle>
              <CardDescription>Real-time system performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resource Monitoring with Trends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemResources.map(resource => (
                  <div key={resource.name} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{resource.name}</h3>
                      <Badge variant={resource.status === 'good' ? 'default' : 'destructive'}>
                        {resource.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress value={(resource.usage / resource.limit) * 100} />
                    <div className="mt-2 text-sm text-muted-foreground">
                      Trend: {resource.trend} | History: {resource.history.join(', ')}%
                    </div>
                  </div>
                ))}
              </div>

              {/* Audit Logs */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Audit Logs</h3>
                <div className="space-y-2">
                  {auditLogs.map(log => (
                    <div key={log.id} className="flex items-center justify-between border-b py-2">
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.user} - {log.timestamp}
                        </p>
                      </div>
                      <Badge variant={log.severity === 'high' ? 'destructive' : 'default'}>
                        {log.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Configuration</CardTitle>
              <CardDescription>Manage network settings and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* VPN Settings */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>VPN Connection</Label>
                  <p className="text-sm text-muted-foreground">
                    Secure your network traffic
                  </p>
                </div>
                <Switch
                  checked={networkConfig.vpnEnabled}
                  onCheckedChange={(checked) => 
                    setNetworkConfig(prev => ({...prev, vpnEnabled: checked}))}
                />
              </div>

              {/* Bandwidth Monitor */}
              <div className="space-y-4">
                <h3 className="font-medium">Bandwidth Usage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Upload</Label>
                    <Progress value={(networkConfig.bandwidth.upload / 100) * 100} />
                    <p className="text-sm text-muted-foreground mt-1">
                      {networkConfig.bandwidth.upload} Mbps
                    </p>
                  </div>
                  <div>
                    <Label>Download</Label>
                    <Progress value={(networkConfig.bandwidth.download / 100) * 100} />
                    <p className="text-sm text-muted-foreground mt-1">
                      {networkConfig.bandwidth.download} Mbps
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Connections */}
              <div>
                <h3 className="font-medium mb-2">Active Connections</h3>
                <Alert>
                  <Network className="w-4 h-4" />
                  <AlertTitle>Network Status</AlertTitle>
                  <AlertDescription>
                    {networkConfig.activeConnections} active connections
                    Firewall Status: {networkConfig.firewallStatus}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Backup Configuration</CardTitle>
              <CardDescription>Manage system backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Last backup: {backupConfig.lastBackup}
                  </p>
                </div>
                <Switch
                  checked={backupConfig.autoBackup}
                  onCheckedChange={(checked) => 
                    setBackupConfig(prev => ({...prev, autoBackup: checked}))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select 
                    value={backupConfig.frequency}
                    onValueChange={(value) => 
                      setBackupConfig(prev => ({...prev, frequency: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Retention Period (days)</Label>
                  <Select 
                    value={backupConfig.retentionDays.toString()}
                    onValueChange={(value) => 
                      setBackupConfig(prev => ({...prev, retentionDays: parseInt(value)}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
            <ProfileTab
                userData={userData}
                onUpdateProfile={(updates) => {
                setUserData(prev => ({ ...prev, ...updates }));
                setUnsavedChanges(true);
                }}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default SettingSystem;