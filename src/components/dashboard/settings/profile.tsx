import React, { useState, useCallback } from "react";
import { Camera, Save, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/base/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/base/avatar";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/base/label";
import { toast } from "sonner";
import { useProfileImage } from "@/components/hooks/useProfileImage";
import { UserData } from "@/types/settings-user";
import { validateEmail, validatePhone } from "@/utils/validation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader } from "@/components/ui/base/card";

interface ProfileTabProps {
  userData: UserData;
  onUpdateProfile: (updates: Partial<UserData>) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  userData,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState(userData);

  const {
    image: profileImage,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
  } = useProfileImage(userData.profileImage);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    const validationErrors: string[] = [];
    if (!formData.fullName.trim())
      validationErrors.push("Full Name is required");
    if (!validateEmail(formData.email))
      validationErrors.push("Invalid email address");
    if (!validatePhone(formData.phone))
      validationErrors.push("Invalid phone number");

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onUpdateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, isSaving, onUpdateProfile]);

  const handleDeleteAccount = useCallback(async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Account deleted successfully!");
      // Redirect to logout or home page
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting]);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 transition-all duration-300 group-hover:opacity-80">
                <AvatarImage
                  src={profileImage || "/placeholder-avatar.png"}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-500 text-white">
                  {formData.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  {profileImage && (
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
                {formData.fullName}
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
              <p className="text-muted-foreground">{formData.email}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Form */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="state">State/Region</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  value={formData.address2 || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            {isEditing ? (
              <>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(userData);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <LoadingSpinner className="mr-2" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
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
      </Card>
    </div>
  );
};

export default ProfileTab;
