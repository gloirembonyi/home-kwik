import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/base/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/base/tabs";
import { Button } from "@/components/ui/base/button";
import { Textarea } from "@/components/ui/base/textarea";
import { Input } from "@/components/ui/Input";
import { User } from "./all-users";

interface SMSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

const SMSDialog: React.FC<SMSDialogProps> = ({ isOpen, onClose, users }) => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  const handleSendSingle = async () => {
    if (!selectedUser || !message) {
      alert("Please select a user and write a message");
      return;
    }
    // TODO: Implement SMS sending logic here
    console.log("Sending SMS to:", selectedUser, "Message:", message);
    onClose();
  };

  const handleSendBulk = async () => {
    if (!uploadedFile || !message) {
      alert("Please upload a file and write a message");
      return;
    }
    // TODO: Implement bulk SMS sending logic here
    console.log("Sending bulk SMS, File:", uploadedFile, "Message:", message);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Send SMS</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="single"
          className="w-full"
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(value as "single" | "bulk")
          }
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single">Send to a User</TabsTrigger>
            <TabsTrigger value="bulk">Send to Many Users</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a user...</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.phoneNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="min-h-32"
                />
              </div>

              <Button
                onClick={handleSendSingle}
                className="w-full bg-blue-900 text-white hover:bg-blue-800"
              >
                Send
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bulk">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <Input
                          type="file"
                          className="sr-only"
                          onChange={handleFileUpload}
                          id=""
                          accept=".csv,.xlsx,.xls"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      CSV, XLSX up to 10MB
                    </p>
                  </div>
                </div>
                {uploadedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {uploadedFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="min-h-32"
                />
              </div>

              <Button
                onClick={handleSendBulk}
                className="w-full bg-blue-900 text-white hover:bg-blue-800"
              >
                Send
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SMSDialog;
