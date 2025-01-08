// components/settings/RidePreferencesTab.tsx
import React from 'react';
import { Car, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/base/card';
import { Label } from '@/components/ui/base/label';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/base/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/base/select';
import { UserData } from '@/types/settings-user';

interface RidePreferencesTabProps {
  userData: UserData;
  onUpdatePreferences: (updates: Partial<UserData>) => void;
}

export const RidePreferencesTab: React.FC<RidePreferencesTabProps> = ({
  userData,
  onUpdatePreferences,
}) => {
  const vehicleTypes = ['Sedan', 'SUV', 'Luxury', 'Electric', 'Hybrid'];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Car className="text-gray-500" />
            <h3 className="font-semibold">Vehicle Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Preferred Vehicle Types</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {vehicleTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Switch
                      checked={userData.vehiclePreferences?.preferredTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        const currentTypes = userData.vehiclePreferences?.preferredTypes || [];
                        const newTypes = checked
                          ? [...currentTypes, type]
                          : currentTypes.filter((t) => t !== type);
                        onUpdatePreferences({
                          vehiclePreferences: {
                            ...userData.vehiclePreferences,
                            preferredTypes: newTypes,
                          },
                        });
                      }}
                    />
                    <Label>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Transmission Preference</Label>
              <Select
                value={userData.vehiclePreferences?.transmission}
                onValueChange={(value: 'automatic' | 'manual' | 'both') =>
                  onUpdatePreferences({
                    vehiclePreferences: {
                      ...userData.vehiclePreferences,
                      transmission: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic Only</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                  <SelectItem value="both">No Preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Clock className="text-gray-500" />
            <h3 className="font-semibold">Availability Schedule</h3>
          </div>
          
          <div className="space-y-4">
            {/* Weekly schedule grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={day} className="text-center">
                  <Label>{day}</Label>
                  <div className="mt-2">
                    <Input
                      type="time"
                      value={userData.ridePreferences?.availabilitySchedule[index]?.startTime}
                      onChange={(e) => {
                        const newSchedule = [...(userData.ridePreferences?.availabilitySchedule || [])];
                        newSchedule[index] = {
                          ...newSchedule[index],
                          startTime: e.target.value,
                        };
                        onUpdatePreferences({
                          ridePreferences: {
                            ...userData.ridePreferences,
                            availabilitySchedule: newSchedule,
                          },
                        });
                      }}
                      className="mb-2"
                      id={`${day}-start`}
                    />
                    <Input
                      type="time"
                      value={userData.ridePreferences?.availabilitySchedule[index]?.endTime}
                      onChange={(e) => {
                        const newSchedule = [...(userData.ridePreferences?.availabilitySchedule || [])];
                        newSchedule[index] = {
                          ...newSchedule[index],
                          endTime: e.target.value,
                        };
                        onUpdatePreferences({
                          ridePreferences: {
                            ...userData.ridePreferences,
                            availabilitySchedule: newSchedule,
                          },
                        });
                      }}
                      id={`${day}-end`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <MapPin className="text-gray-500" />
            <h3 className="font-semibold">Location Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Maximum Travel Distance (miles)</Label>
              <Input
                type="number"
                value={userData.ridePreferences?.maxDistance}
                onChange={(e) =>
                  onUpdatePreferences({
                    ridePreferences: {
                      ...userData.ridePreferences,
                      maxDistance: parseInt(e.target.value),
                    },
                  })
                }
                min={1}
                max={100}
                id="max-distance"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
