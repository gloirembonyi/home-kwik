import React from "react";

const RideAnalytics: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/3 bg-gray-50 p-6 border-r border-gray-200">
        <h1 className="text-2xl font-bold mb-8">Fleet</h1>

        {/* Active Vehicle Section */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          {/* Vehicle Information */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-10.5-6h13.5M4.5 15H19.5M4.5 9l1.125-3.375a2.25 2.25 0 012.137-1.625h8.476a2.25 2.25 0 012.138 1.625L19.5 9M4.5 9h15"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">DR-653CD3</h2>
              <p className="text-sm text-gray-500">Kigali, Rwanda</p>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Rating (good)</p>
            <div className="relative h-2 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-2 bg-blue-600 rounded"
                style={{ width: "50%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">2.5</p>
          </div>

          {/* Timeline Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
              <div className="ml-4">
                <p className="text-sm font-semibold">Pickup</p>
                <p className="text-sm text-gray-500">Sep 01, 7:53 AM</p>
              </div>
            </div>
            <div className="flex items-center relative">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
              <div className="ml-4">
                <p className="text-sm font-semibold">Ongoing trip</p>
                <p className="text-sm text-gray-500">Sep 01, 8:02 AM</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
              <div className="ml-4">
                <p className="text-sm font-semibold">Arrived</p>
                <p className="text-sm text-gray-500">Sep 01, 8:18 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Other Vehicles */}
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-white shadow-sm rounded-lg"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-10.5-6h13.5M4.5 15H19.5M4.5 9l1.125-3.375a2.25 2.25 0 012.137-1.625h8.476a2.25 2.25 0 012.138 1.625L19.5 9M4.5 9h15"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">DR-653CD{index + 4}</h3>
                <p className="text-sm text-gray-500">Kigali, Rwanda</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Map Section */}
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <iframe
            title="Map"
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d24176.01944482793!2d-74.0033343!3d40.7430584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1637026261836!5m2!1sen!2sus"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </main>
    </div>
  );
};

export default RideAnalytics;

