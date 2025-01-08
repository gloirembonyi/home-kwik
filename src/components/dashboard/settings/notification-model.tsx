import { useState } from "react";
import { Switch } from "@headlessui/react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/solid";


const NotificationModal = () => {
  const [accountActivity, setAccountActivity] = useState(false);
  const [contactSupportUpdates, setContactSupportUpdates] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          <p className="text-sm text-gray-500">Get notified of all activity in Kwik Ride app</p>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between py-3 border rounded-md px-4 mb-4">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-800">Account Activity</h3>
                <p className="text-sm text-gray-500">
                  Get important notifications about you or activity you’ve missed
                </p>
              </div>
            </div>
            <Switch
              checked={accountActivity}
              onChange={setAccountActivity}
              className={`${
                accountActivity ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  accountActivity ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between py-3 border rounded-md px-4">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="w-6 h-6 text-gray-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-800">Contact Support Updates</h3>
                <p className="text-sm text-gray-500">
                  Get an email when a user contacts support or sends a message to the technical team
                </p>
              </div>
            </div>
            <Switch
              checked={contactSupportUpdates}
              onChange={setContactSupportUpdates}
              className={`${
                contactSupportUpdates ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  contactSupportUpdates ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full`}
              />
            </Switch>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => console.log("Cancel")}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => console.log("Update Notifications")}
          >
            Update Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
