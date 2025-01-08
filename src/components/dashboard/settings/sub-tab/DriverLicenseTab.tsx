// components/settings/DriverLicenseTab.tsx
import React, { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/base/card';
import { Label } from '@/components/ui/base/label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/base/button';
import { UserData } from '@/types/settings-user';

interface DriverLicenseTabProps {
  userData: UserData;
  onUpdateLicense: (updates: Partial<UserData>) => void;
}

export const DriverLicenseTab: React.FC<DriverLicenseTabProps> = ({
  userData,
  onUpdateLicense,
}) => {
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFile(file);
      // Handle file upload logic
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <FileText className="text-gray-500" />
            <h3 className="font-semibold">Driver License Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>License Number</Label>
              <Input
                value={userData.driverLicense?.number}
                onChange={(e) =>
                  onUpdateLicense({
                    driverLicense: {
                      ...userData.driverLicense,
                      number: e.target.value,
                    },
                  })
                }
                placeholder="Enter license number"
                id="license-number"
              />
            </div>

            <div>
              <Label>Expiration Date</Label>
              <Input
                type="date"
                value={userData.driverLicense?.expiry.toISOString().split('T')[0]}
                onChange={(e) =>
                  onUpdateLicense({
                    driverLicense: {
                      ...userData.driverLicense,
                      expiry: new Date(e.target.value),
                    },
                  })
                }
                id="license-expiry"
              />
            </div>

            <div>
              <Label>State/Region</Label>
              <Input
                value={userData.driverLicense?.state}
                onChange={(e) =>
                  onUpdateLicense({
                    driverLicense: {
                      ...userData.driverLicense,
                      state: e.target.value,
                    },
                  })
                }
                placeholder="Enter issuing state/region"
                id="license-state"
              />
            </div>

            <div>
              <Label>Upload License Image</Label>
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('license-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload License
                </Button>
                <input
                  type="file"
                  id="license-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                {licenseFile && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected file: {licenseFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};