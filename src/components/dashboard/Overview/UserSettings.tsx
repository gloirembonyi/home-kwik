import React, { useState } from "react";
import { User, Settings, Globe, MapPin, Phone, Mail, Edit2 } from "lucide-react";

const SettingsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "Miron Vitold",
    email: "miron.vitold@gmail.com",
    country: "USA",
    state: "New York",
    address1: "Street John Wick, no. 7",
    address2: "House #25",
    phone: "+55 748 327 439"
  });
  const [roleSwitch, setRoleSwitch] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = () => {
    // Implement update logic here
    console.log("Updated Profile:", formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-100 min-h-screen -p-8">
      <div className="mx-auto bg-white shadow-2xl overflow-hidden">
        {/* <header className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <User className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">User Settings</h1>
              <p className="text-sm text-blue-100">Manage your profile and preferences</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="p-2 pl-8 pr-4 rounded-full bg-blue-500 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <svg className="absolute left-2 top-3 w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Robert Allen</span>
              <span className="text-sm bg-blue-500 px-2 py-1 rounded-full">Super Admin</span>
            </div>
          </div>
        </header> */}

        <main className="">
          <section className="grid md:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="md:col-span-1 bg-gray-50 rounded-lg p-6 text-center">
              <div className="mx-auto w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">{formData.fullName}</h2>
              <p className="text-gray-500">Super Admin</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span>{formData.country}, {formData.state}</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Edit2 className="mr-2 w-6 h-6 text-blue-600" />
                    Edit Profile
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">User ID:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">5e86805e2bafd54f66cc95c3</code>
                  </div>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", name: "fullName", icon: User },
                    { label: "Email Address", name: "email", icon: Mail },
                    { label: "Country", name: "country", icon: Globe },
                    { label: "State/Region", name: "state", icon: MapPin },
                    { label: "Address 1", name: "address1", icon: MapPin },
                    { label: "Address 2", name: "address2", icon: MapPin },
                    { label: "Phone Number", name: "phone", icon: Phone }
                  ].map(({ label, name, icon: Icon }) => (
                    <div key={name}>
                      <label className="flex items-center font-medium mb-2">
                        <Icon className="mr-2 w-5 h-5 text-blue-600" />
                        {label}
                      </label>
                      <input
                        type="text"
                        name={name}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          isEditing 
                            ? 'bg-white' 
                            : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  ))}
                </form>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label htmlFor="roleSwitch" className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-gray-700">Role Switching</span>
                      <input
                        type="checkbox"
                        id="roleSwitch"
                        checked={roleSwitch}
                        onChange={() => setRoleSwitch(!roleSwitch)}
                        className="toggle-checkbox h-5 w-10 rounded-full bg-gray-300 focus:ring focus:ring-blue-300"
                      />
                    </label>
                  </div>
                  <div>
                    {isEditing ? (
                      <>
                        <button 
                          onClick={handleUpdateProfile}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="ml-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-md shadow hover:bg-gray-200 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
                
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-700">
                  <strong>Note:</strong> Your contact details are visible to your profile. Please ensure all information is accurate.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;