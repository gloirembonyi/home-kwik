import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { IUserToDelete } from "@/types/@types";
import { Star } from "lucide-react";

interface UserDetailsCardProps {
  user: IUserToDelete;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ user }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.names}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-gray-600">
                {user.names.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <CardTitle className="text-lg">{user.names}</CardTitle>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium capitalize">{user.status}</p>
          </div>
          <div>
            <p className="text-gray-500">User Type</p>
            <p className="font-medium capitalize">{user.usertype}</p>
          </div>
          <div>
            <p className="text-gray-500">Rating</p>
            <p className="font-medium flex items-center">
              {user.rating}
              <Star className="h-4 w-4 text-yellow-400 ml-1" fill="currentColor" />
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total Rides</p>
            <p className="font-medium">{user.totalRides}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard