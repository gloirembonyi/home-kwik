import React from "react";
import { Card, CardContent } from "@/components/ui/base/card";
import { Input } from "@/components/ui/base/input";
import { Label } from "@/components/ui/base/label";
import { Button } from "@/components/ui/base/button";
import { User, Mail } from "lucide-react";
import { useSettings } from "../settings-context";

const GeneralTab = () => {
  const { settings, handleUpdateProfile, isLoading } = useSettings();

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <div className="flex justify-between items-center mt-1">
              <Input
                value={settings.fullName}
                onChange={(e) =>
                  handleUpdateProfile("fullName", e.target.value)
                }
                className="max-w-md bg-background"
                disabled={isLoading}
              />
              <Button variant="outline" size="sm" disabled={isLoading}>
                Save
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <div className="flex justify-between items-center mt-1">
              <Input
                value={settings.email}
                onChange={(e) => handleUpdateProfile("email", e.target.value)}
                className="max-w-md bg-background"
                disabled={isLoading}
              />
              <Button variant="outline" size="sm" disabled={isLoading}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralTab;
