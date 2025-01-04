import React, { useState, useRef, useCallback } from 'react';
import { 
  User, 
  Camera, 
  Save, 
  X, 
  MapPin, 
  Mail, 
  Phone, 
  Edit2, 
  AlertTriangle 
} from 'lucide-react';

import { Button } from "@/components/ui/base/button";
import { Label } from "@/components/ui/base/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/base/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/base/card";
import { Switch } from "@/components/ui/base/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/base/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter,
  DialogClose
} from "@/components/ui/base/dialog";
import { toast } from "sonner";
import { Input } from '@/components/ui/Input';

// User Data Interface
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
  role: 'user' | 'admin' | 'driver';
  preferences: {
    notifications: boolean;
    darkMode: boolean;
  };
}

// Form Errors Interface
interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

const SettingsPage: React.FC = () => {
  // Initial User Data
  const [userData, setUserData] = useState<UserData>({
    id: 'user-123',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    state: 'California',
    address1: '123 Main Street',
    address2: 'Apt 45',
    profileImage: '',
    role: 'user',
    preferences: {
      notifications: true,
      darkMode: false
    }
  });

  // Form State Management
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>(userData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Profile Image Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation Function
  const validateForm = useCallback(() => {
    const errors: FormErrors = {};

    // Full Name Validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone Validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    setHasChanges(JSON.stringify(newFormData) !== JSON.stringify(userData));
  };

  // Handle Profile Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFormData = { 
          ...formData, 
          profileImage: reader.result as string 
        };
        setFormData(newFormData);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Profile Image
  const handleRemoveImage = () => {
    const newFormData = { ...formData, profileImage: '' };
    setFormData(newFormData);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setHasChanges(true);
  };

  // Save Changes
  const handleSave = () => {
    if (validateForm()) {
      try {
        // Simulate API call
        setUserData(formData);
        setIsEditing(false);
        setHasChanges(false);
        
        toast.success('Profile Updated', {
          description: 'Your profile has been successfully updated.'
        });
      } catch (error) {
        toast.error('Update Failed', {
          description: 'Unable to update profile. Please try again.'
        });
      }
    } else {
      toast.error('Validation Error', {
        description: 'Please correct the highlighted errors.'
      });
    }
  };

  // Cancel Editing
  const handleCancel = () => {
    if (hasChanges) {
      return (
        <Dialog open={hasChanges}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard Changes?</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Are you sure you want to discard them?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFormData(userData);
                  setIsEditing(false);
                  setHasChanges(false);
                  toast.info('Changes Discarded');
                }}
              >
                Discard
              </Button>
              <DialogClose asChild>
                <Button variant="default">Keep Editing</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
    
    setFormData(userData);
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Profile Image Section */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={formData.profileImage || '/placeholder-avatar.png'} 
                  alt="Profile" 
                />
                <AvatarFallback>{formData.fullName[0]}</AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <div className="absolute bottom-0 right-0 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.fullName}</h2>
              <p className="text-muted-foreground">{formData.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <Label>Full Name</Label>
              <Input 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={formErrors.fullName ? 'border-red-500' : ''} id={''}              />
              {formErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={formErrors.email ? 'border-red-500' : ''} id={''}              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <Input 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={formErrors.phone ? 'border-red-500' : ''} id={''}              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label>Account Role</Label>
              <Select 
                value={formData.role}
                onValueChange={(value: UserData['role']) => {
                  setFormData(prev => ({ ...prev, role: value }));
                  setHasChanges(true);
                }}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 w-4 h-4" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  <X className="mr-2 w-4 h-4" /> Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  <Save className="mr-2 w-4 h-4" /> Save Changes
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default SettingsPage;