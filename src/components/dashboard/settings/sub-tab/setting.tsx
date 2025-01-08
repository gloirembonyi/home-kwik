// import React, { useState, useCallback, useEffect } from "react";
// import { Camera, Save, Trash2, Edit2, AlertTriangle } from "lucide-react";
// import { Button } from "@/components/ui/base/button";
// import { Card, CardContent } from "@/components/ui/base/card";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/base/avatar";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/base/tabs";
// import { Input } from "@/components/ui/Input";
// import { Label } from "@/components/ui/base/label";
// import { toast } from "sonner";
// import { useProfileImage } from "@/components/hooks/useProfileImage";
// import { NotificationSettings, UserData } from "@/types/settings-user";
// import { validateEmail, validatePhone } from "@/utils/validation";
// import { PrivacyTab } from "./PrivacyTab";
// import { SecurityTab } from "./SecurityTab";
// import {
//   Alert,
//   AlertTitle,
//   AlertDescription,
// } from "@/components/ui/base/alert";
// import { NotificationsTab } from "../NotificationsTab";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { DriverLicenseTab } from "./DriverLicenseTab";
// import { RidePreferencesTab } from "./RidePreferencesTab";

// export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
//   email: {
//     security: true,
//     updates: true,
//     marketing: false,
//     newsletter: false,
//   },
//   push: {
//     security: true,
//     updates: false,
//     reminders: true,
//     messages: true,
//   },
//   frequency: "immediate",
//   quiet_hours: {
//     enabled: false,
//     start: "22:00",
//     end: "07:00",
//   },
// };

// export const SettingsPage: React.FC = () => {
//   const [userData, setUserData] = useState<UserData>({
//     id: "usr_123456",
//     fullName: "John Doe",
//     email: "john.doe@example.com",
//     phone: "+1 (555) 123-4567",
//     country: "United States",
//     state: "California",
//     address1: "123 Main Street",
//     address2: "Apt 4B",
//     profileImage: "",
//     roleSwitching: false,
//     twoFactorAuth: false,
//     privacyLevel: "medium",
//     accountCreated: new Date("2023-01-15"),
//     lastLogin: new Date(),
//     passwordLastChanged: new Date("2023-12-01"),
//     failedLoginAttempts: 0,
//     loginHistory: [
//       {
//         timestamp: new Date(),
//         ipAddress: "192.168.1.1",
//         deviceInfo: "Chrome on Windows",
//         location: "San Francisco, CA",
//         status: "success",
//       },
//     ],
//     deviceHistory: [
//       {
//         id: "dev_1",
//         deviceName: "Windows PC",
//         browser: "Chrome",
//         os: "Windows 11",
//         lastActive: new Date(),
//         isCurrent: true,
//       },
//     ],
//     notifications: DEFAULT_NOTIFICATION_SETTINGS,
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [activeTab, setActiveTab] = useState<
//     "profile" | "security" | "privacy" | "notifications"
//   >("profile");
//   const [unsavedChanges, setUnsavedChanges] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const {
//     image: profileImage,
//     fileInputRef,
//     handleImageUpload,
//     handleRemoveImage,
//   } = useProfileImage(userData.profileImage);

//   // Handle unsaved changes warning
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (unsavedChanges) {
//         e.preventDefault();
//         e.returnValue = "";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [unsavedChanges]);

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e.target;
//       setUserData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//       setUnsavedChanges(true);
//     },
//     []
//   );

//   // Update handleSave
//   const handleSave = useCallback(async () => {
//     if (isSaving) return;

//     const validationErrors: string[] = [];
//     if (!userData.fullName.trim())
//       validationErrors.push("Full Name is required");
//     if (!validateEmail(userData.email))
//       validationErrors.push("Invalid email address");
//     if (!validatePhone(userData.phone))
//       validationErrors.push("Invalid phone number");

//     if (validationErrors.length > 0) {
//       validationErrors.forEach((error) => toast.error(error));
//       return;
//     }

//     setIsSaving(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       setIsEditing(false);
//       setUnsavedChanges(false);
//       toast.success("Profile updated successfully!");
//     } catch (error) {
//       toast.error("Failed to update profile. Please try again.");
//       console.error("Error updating profile:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [userData, isSaving]);

//   const handleDeleteAccount = useCallback(async () => {
//     if (isDeleting) return;

//     const confirmed = window.confirm(
//       "Are you absolutely sure you want to delete your account? This action cannot be undone."
//     );

//     if (!confirmed) return;

//     setIsDeleting(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       toast.success("Account deleted successfully!");
//       // Redirect to logout or home page
//     } catch (error) {
//       toast.error("Failed to delete account. Please try again.");
//       console.error("Error deleting account:", error);
//     } finally {
//       setIsDeleting(false);
//     }
//   }, [isDeleting]);

//   const handleSecurityUpdate = useCallback((updates: Partial<UserData>) => {
//     setUserData((prev) => ({
//       ...prev,
//       ...updates,
//     }));
//     setUnsavedChanges(true);
//   }, []);

//   const handlePrivacyUpdate = useCallback((updates: Partial<UserData>) => {
//     setUserData((prev) => ({
//       ...prev,
//       ...updates,
//     }));
//     setUnsavedChanges(true);
//   }, []);

//   const handleNotificationUpdate = useCallback(
//     (updates: Partial<NotificationSettings>) => {
//       setUserData((prev) => ({
//         ...prev,
//         notifications: {
//           ...prev.notifications,
//           ...updates,
//         },
//       }));
//       setUnsavedChanges(true);
//     },
//     []
//   );

//   function handlePreferencesUpdate(updates: Partial<UserData>): void {
//     throw new Error("Function not implemented.");
//   }

//   function handleLicenseUpdate(updates: Partial<UserData>): void {
//     throw new Error("Function not implemented.");
//   }

//   function SystemNotifications(updates: Partial<UserData>): void {
//     throw new Error("Function not implemented.");
//   }

//   return (
//     <div className="container mx-auto pb-8">
//       {unsavedChanges && (
//         <Alert className="mb-4">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertTitle>Unsaved Changes</AlertTitle>
//           <AlertDescription>
//             You have unsaved changes. Make sure to save your changes before
//             leaving this page.
//           </AlertDescription>
//         </Alert>
//       )}

//       <Card className="">
//         <Tabs
//           value={activeTab}
//           onValueChange={(val: string) =>
//             setActiveTab(
//               val as "profile" | "security" | "privacy" | "notifications"
//             )
//           }
//         >
//           <TabsList className="grid w-full grid-cols-7 mb-8">
//             <TabsTrigger value="system-notifications">
//               System Notifications
//             </TabsTrigger>
//             <TabsTrigger value="profile">Profile</TabsTrigger>
//             <TabsTrigger value="security">Security</TabsTrigger>
//             <TabsTrigger value="privacy">Privacy</TabsTrigger>
//             <TabsTrigger value="notifications">Notifications</TabsTrigger>
//             <TabsTrigger value="ride-preferences">Ride Preferences</TabsTrigger>
//             <TabsTrigger value="driver-license">Driver License</TabsTrigger>
//           </TabsList>

//           <CardContent>
//             <TabsContent value="profile">
//               {/* Profile Header */}
//               <div className="flex items-center space-x-6 mb-8">
//                 <div className="relative group">
//                   <Avatar className="w-24 h-24 transition-all duration-300 group-hover:opacity-80">
//                     <AvatarImage
//                       src={profileImage || "/placeholder-avatar.png"}
//                       alt="Profile"
//                       className="object-cover"
//                     />
//                     <AvatarFallback className="bg-blue-500 text-white">
//                       {userData.fullName.charAt(0).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   {isEditing && (
//                     <div className="absolute bottom-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="w-8 h-8"
//                         onClick={() => fileInputRef.current?.click()}
//                       >
//                         <Camera className="w-4 h-4" />
//                       </Button>
//                       {profileImage && (
//                         <Button
//                           variant="destructive"
//                           size="icon"
//                           className="w-8 h-8"
//                           onClick={handleRemoveImage}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   accept="image/jpeg,image/png,image/gif"
//                   className="hidden"
//                   onChange={handleImageUpload}
//                 />
//                 <div>
//                   <h2 className="text-2xl font-bold flex items-center">
//                     {userData.fullName}
//                     {!isEditing && (
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="ml-2"
//                         onClick={() => setIsEditing(true)}
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </h2>
//                   <p className="text-muted-foreground">{userData.email}</p>
//                 </div>
//               </div>

//               {/* Profile Form */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="fullName">Full Name</Label>
//                     <Input
//                       id="fullName"
//                       name="fullName"
//                       value={userData.fullName}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="email">Email Address</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={userData.email}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="phone">Phone Number</Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       value={userData.phone}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="country">Country</Label>
//                     <Input
//                       id="country"
//                       name="country"
//                       value={userData.country}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="state">State/Region</Label>
//                     <Input
//                       id="state"
//                       name="state"
//                       value={userData.state}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="address1">Address Line 1</Label>
//                     <Input
//                       id="address1"
//                       name="address1"
//                       value={userData.address1}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="address2">Address Line 2</Label>
//                     <Input
//                       id="address2"
//                       name="address2"
//                       value={userData.address2 || ""}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-between mt-8">
//                 {isEditing ? (
//                   <>
//                     <Button
//                       variant="destructive"
//                       onClick={() => {
//                         if (
//                           window.confirm(
//                             "Are you sure you want to delete your account? This action cannot be undone."
//                           )
//                         ) {
//                           handleDeleteAccount();
//                         }
//                       }}
//                       disabled={isDeleting}
//                     >
//                       {isDeleting ? (
//                         <LoadingSpinner className="mr-2" />
//                       ) : (
//                         <Trash2 className="mr-2 h-4 w-4" />
//                       )}
//                       {isDeleting ? "Deleting..." : "Delete Account"}
//                     </Button>
//                     <div className="space-x-2">
//                       <Button
//                         variant="outline"
//                         onClick={() => setIsEditing(false)}
//                       >
//                         Cancel
//                       </Button>
//                       <Button onClick={handleSave} disabled={isSaving}>
//                         {isSaving ? (
//                           <LoadingSpinner className="mr-2" />
//                         ) : (
//                           <Save className="mr-2 h-4 w-4" />
//                         )}
//                         {isSaving ? "Saving..." : "Save Changes"}
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   <Button variant="default" onClick={() => setIsEditing(true)}>
//                     <Edit2 className="mr-2 h-4 w-4" />
//                     Edit Profile
//                   </Button>
//                 )}
//               </div>
//             </TabsContent>

//             <TabsContent value="security">
//               <SecurityTab
//                 userData={userData}
//                 onUpdateSecurity={handleSecurityUpdate}
//               />
//             </TabsContent>

//             <TabsContent value="privacy">
//               <PrivacyTab
//                 userData={userData}
//                 onUpdatePrivacy={handlePrivacyUpdate}
//               />
//             </TabsContent>

//             <TabsContent value="notifications">
//               <NotificationsTab
//                 userData={userData}
//                 onUpdateNotifications={handleNotificationUpdate}
//               />
//             </TabsContent>

//             <TabsContent value="ride-preferences">
//               <RidePreferencesTab
//                 userData={userData}
//                 onUpdatePreferences={handlePreferencesUpdate}
//               />
//             </TabsContent>

//             <TabsContent value="driver-license">
//               <DriverLicenseTab
//                 userData={userData}
//                 onUpdateLicense={handleLicenseUpdate}
//               />
//             </TabsContent>
//             <TabsContent value="system-notifications">
//               <DriverLicenseTab
//                 userData={userData}
//                 onUpdateLicense={SystemNotifications}
//               />
//             </TabsContent>
//           </CardContent>
//         </Tabs>
//       </Card>

//       {/* Save changes footer */}
//       {unsavedChanges && (
//         <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
//           <div className="container mx-auto flex justify-end space-x-4">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setUnsavedChanges(false);
//                 setIsEditing(false);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>
//               <Save className="mr-2 h-4 w-4" />
//               Save Changes
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SettingsPage;
