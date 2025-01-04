import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Save,
  Trash2,
  X,
  Edit,
  ArrowLeftIcon,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/base/button";
import { Label } from "@/components/ui/base/label";
import { Card, CardContent, CardHeader } from "@/components/ui/base/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/base/avatar";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/base/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/base/dialog";

// User detailed interface fields
interface User {
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

interface UserDetailProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
  onDelete: (user: User) => void;
  initialEditMode?: boolean;
}

const UserDetail: React.FC<UserDetailProps> = ({
  user,
  onClose,
  onSave,
  onDelete,
  initialEditMode = false,
}) => {
  const [userData, setUserData] = useState<User>({ ...user });
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track changes
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(user) !== JSON.stringify(userData);
    setHasChanges(hasUnsavedChanges);
  }, [userData, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setUserData((prev) => ({
      ...prev,
      roleSwitching: checked,
    }));
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = () => {
    if (!userData.fullName?.trim()) {
      toast.error("Full Name is required");
      return;
    }

    // Save changes
    onSave(userData);
    toast.success("Profile Updated Successfully");
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      return (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard Changes?</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Are you sure you want to discard them?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Keep Editing</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  setUserData({ ...user });
                  setIsEditing(false);
                  toast.info("Changes Discarded");
                }}
              >
                Discard Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    // If no changes, simply cancel editing
    setUserData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="border-b p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={onClose}
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Users</span>
            </Button>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfileImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Avatar className="w-32 h-32 relative group">
                {userData.profileImage ? (
                  <AvatarImage
                    src={userData.profileImage}
                    alt={`${userData.fullName ?? "User"}'s profile`}
                  />
                ) : (
                  <AvatarFallback className="text-3xl">
                    {userData.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                )}
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black bg-opacity-50 text-white 
      flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                )}
              </Avatar>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{userData.fullName}</h2>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{userData.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Editable Form Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg pl-4 pt-4">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter full name"
                />
              </div>

              <div className="border border-gray-300 rounded-lg  pl-4 pt-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter email address"
                />
              </div>

              <div className="border border-gray-300 rounded-lg  pl-4 pt-4">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="border border-gray-300 rounded-lg  pl-4 pt-4">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={userData.country || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg  pl-4 pt-4">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={userData.state || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter state"
                />
              </div>

              <div className="border border-gray-300 rounded-lg  pl-4 pt-4">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  name="address1"
                  value={userData.address1 || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Street address"
                />
              </div>

              <div className="border border-gray-300 rounded-lg  pl-4 pt-4">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  value={userData.address2 || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Apartment, suite, etc."
                />
              </div>
            </div>
            <div className=" border-gray-300 rounded-lg flex items-center justify-between p-6">
              <Label htmlFor="roleSwitching">Role Switching</Label>
              <Switch
                id="roleSwitching"
                checked={userData.roleSwitching}
                onCheckedChange={isEditing ? handleSwitchChange : undefined}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Buttons Section */}
          {isEditing && (
            <div className="flex justify-between items-center mt-6">
              <Button variant="destructive" onClick={() => onDelete(user)}>
                Delete Account
              </Button>
              <div className="space-x-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 w-4 h-4" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={!hasChanges}>
                  <Save className="mr-2 w-4 h-4" /> Update Profile
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;
