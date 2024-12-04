import React, { useState, useRef, useCallback, useMemo } from "react";
import { 
  Camera, 
  Save, 
  Trash2, 
  Edit2, 
  AlertTriangle, 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Lock,
  Shield,
  Key
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/base/button";
import { Label } from "@/components/ui/base/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/base/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/base/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/base/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/base/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/base/tabs";
import { Progress } from "@/components/ui/base/progress";

// Country and State data (mock data - replace with actual comprehensive list)
const COUNTRIES = [
  { name: "United States", states: ["New York", "California", "Texas"] },
  { name: "Canada", states: ["Ontario", "Quebec", "British Columbia"] },
  { name: "United Kingdom", states: ["England", "Scotland", "Wales"] }
];

// Advanced User Data Interface
interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  address1: string;
  address2?: string;
  profileImage?: string;
  roleSwitching: boolean;
  twoFactorAuth: boolean;
  privacyLevel: 'low' | 'medium' | 'high';
  accountCreated: Date;
  lastLogin: Date;
}

// Validation Utilities
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^(\+\d{1,3}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4})$/.test(phone);

const SettingsPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    id: 'usr_123456',
    fullName: "Goire Mbonyi",
    email: "gloire.miron@gmail.com",
    phone: "+1 (748) 327-4390",
    country: "United States",
    state: "New York",
    address1: "123 Tech Innovation Street",
    address2: "Apt 42",
    profileImage: "",
    roleSwitching: false,
    twoFactorAuth: false,
    privacyLevel: 'medium',
    accountCreated: new Date('2023-01-15'),
    lastLogin: new Date()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy'>('profile');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute available states based on selected country
  const availableStates = useMemo(() => {
    const selectedCountry = COUNTRIES.find(c => c.name === userData.country);
    return selectedCountry ? selectedCountry.states : [];
  }, [userData.country]);

  // Password strength calculation (mock implementation)
  const calculatePasswordStrength = useCallback((password: string) => {
    let strength = 0;
    if (password.length > 7) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
    return strength;
  }, []);

  // Complex save handler with multiple validations
  const handleSave = useCallback(() => {
    const validationErrors: string[] = [];

    if (!userData.fullName.trim()) validationErrors.push("Full Name is required");
    if (!validateEmail(userData.email)) validationErrors.push("Invalid email address");
    if (!validatePhone(userData.phone)) validationErrors.push("Invalid phone number");

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    // Simulate API save with loading state
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Saving profile changes...",
        success: "Profile updated successfully!",
        error: "Failed to update profile"
      }
    );

    setIsEditing(false);
  }, [userData]);

  // Render security tab content
  const renderSecurityTab = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Lock className="text-gray-500" />
        <div className="flex-grow">
          <h3 className="font-semibold">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
        </div>
        <Switch
          checked={userData.twoFactorAuth}
          onCheckedChange={(checked) => 
            setUserData(prev => ({ ...prev, twoFactorAuth: checked }))
          }
        />
      </div>

      <div>
        <Label>Password Strength</Label>
        <div className="flex items-center space-x-2">
          <Input 
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setPasswordStrength(calculatePasswordStrength(e.target.value))} id={""}          />
          <Progress value={passwordStrength} className="w-full" />
        </div>
      </div>
    </div>
  );

  // Render privacy tab content
  const renderPrivacyTab = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Shield className="text-gray-500" />
        <div className="flex-grow">
          <h3 className="font-semibold">Privacy Level</h3>
          <p className="text-sm text-gray-500">Control your account's visibility</p>
        </div>
        <Select 
          value={userData.privacyLevel}
          onValueChange={(value: 'low' | 'medium' | 'high') => 
            setUserData(prev => ({ ...prev, privacyLevel: value }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Privacy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUserData((prev) => ({
      ...prev,
      profileImage: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteAccount = (p0: boolean) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("Account deleted");
        }, 2000);
      }),
      {
        loading: "Deleting account...",
        success: "Account deleted successfully!",
        error: "Failed to delete account.",
      }
    );
  };

  function setIsDeleteDialogOpen(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="container -mt-6 -mr-6">
      <Card className="shadow-lg">
        {/* <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center">
            <User className="mr-2" /> User Profile Settings
          </CardTitle>
          <CardDescription>
            Manage your personal information, security, and privacy settings
          </CardDescription>
        </CardHeader> */}
        
        <Tabs value={activeTab} onValueChange={(val: 'profile' | 'security' | 'privacy') => setActiveTab(val)}>
          <TabsList className="grid w-full grid-cols-3 my-4 px-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <CardContent>
            <TabsContent value="profile">
            <CardContent>
          {/* Profile Section */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 transition-all duration-300 group-hover:opacity-80">
                <AvatarImage
                  src={userData.profileImage || "/placeholder-avatar.png"}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-500 text-white">
                  {userData.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  {userData.profileImage && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                {userData.fullName}
                {!isEditing && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </h2>
              <p className="text-muted-foreground">{userData.email}</p>
            </div>
          </div>

          {/* Editable Form Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={userData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="state">State/Region</Label>
                <Input
                  id="state"
                  name="state"
                  value={userData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="address1">Address 1</Label>
                <Input
                  id="address1"
                  name="address1"
                  value={userData.address1}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="address2">Address 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  value={userData.address2 || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="roleSwitching">Role Switching</Label>
                <Switch
                  id="roleSwitching"
                  checked={userData.roleSwitching}
                  onCheckedChange={(checked) =>
                    setUserData((prev) => ({ ...prev, roleSwitching: checked }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex justify-between mt-6">
            {isEditing ? (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteAccount(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="default" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
            </TabsContent>

            <TabsContent value="security">
              {renderSecurityTab()}
            </TabsContent>

            <TabsContent value="privacy">
              {renderPrivacyTab()}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage;