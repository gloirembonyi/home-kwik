import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Save,
  Trash2,
  X,
  Edit,
  ArrowBigLeftIcon,
  ArrowLeftIcon,
} from "lucide-react";

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

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  address1: string;
  address2: string;
  profileImage?: string;
  roleSwitching: boolean;
}

const UserDetail: React.FC = () => {
  const [originalUserData, setOriginalUserData] = useState<UserData>({
    fullName: "Miron Vitold",
    email: "miron.vitold@gmail.com",
    phone: "+55 748 327 439",
    country: "USA",
    state: "New York",
    address1: "Street John Wick, no. 7",
    address2: "House #25",
    profileImage: "",
    roleSwitching: false,
  });

  const [userData, setUserData] = useState<UserData>({ ...originalUserData });
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track changes
  useEffect(() => {
    const hasUnsavedChanges =
      JSON.stringify(originalUserData) !== JSON.stringify(userData);
    setHasChanges(hasUnsavedChanges);
  }, [userData, originalUserData]);

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

  const handleSave = () => {
    // Validate inputs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!userData.fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    if (!emailRegex.test(userData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!phoneRegex.test(userData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Save changes
    setOriginalUserData({ ...userData });
    toast.success("Profile Updated Successfully");
    setIsEditing(false);
    setHasChanges(false);
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
                  setUserData({ ...originalUserData });
                  setIsEditing(false);
                  setHasChanges(false);
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
    setUserData({ ...originalUserData });
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleDeleteAccount = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
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
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="border-b p-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" className="flex items-center space-x-2">
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
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={userData.profileImage || "/placeholder-avatar.png"}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl">
                  {userData.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0 flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  {userData.profileImage && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full"
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
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{userData.fullName}</h2>
              <p className="text-muted-foreground">{userData.email}</p>
            </div>
          </div>

          {/* Editable Form Section */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className=" border border-gray-300 rounded-lg p-6 ">
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

              <div className="border border-gray-300 rounded-lg">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={userData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter country"
                />
              </div>

              <div className="border border-gray-300 rounded-lg">
                <Label htmlFor="address1">Address 1</Label>
                <Input
                  id="address1"
                  name="address1"
                  value={userData.address1}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Street address"
                />
              </div>

              <div className="border border-gray-300 rounded-lg">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="+XX XXX XXX XXXX"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter email address"
                />
              </div>

              <div className="border border-gray-300 rounded-lg">
                <Label htmlFor="state">State/Region</Label>
                <Input
                  id="state"
                  name="state"
                  value={userData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter state or region"
                />
              </div>

              <div className="border border-gray-300 rounded-lg">
                <Label htmlFor="address2">Address 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  value={userData.address2}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Apt, suite, unit, etc. (optional)"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
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

          {/* Buttons Section */}
          {isEditing && (
            <div className="flex justify-between items-center mt-6">
              <Button variant="destructive" onClick={handleDeleteAccount}>
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
