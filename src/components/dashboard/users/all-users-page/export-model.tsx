import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/base/dialog';

const ExportDialog = ({ isOpen, onClose, users, selectedUsers }) => {
  const [selectedFields, setSelectedFields] = useState(['Status', 'Email', 'Issue']);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fieldButtonRef = useRef(null);

  const availableFields = [
    'Name', 'Email', 'Status', 'Phone Number', 'Role', 
    'Gender', 'Issue', 'User ID', 'Join Date', 'Department'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) && 
          !fieldButtonRef.current.contains(event.target)) {
        setIsFieldDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = () => {
    const usersToExport = selectedUsers.length > 0 
      ? users.filter(user => selectedUsers.includes(user.id))
      : users;

    const headers = selectedFields.join(',');
    const rows = usersToExport.map(user => 
      selectedFields.map(field => {
        const value = user[field.toLowerCase().replace(' ', '')] || '';
        return `"${value}"`;
      }).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-3xl p-8">
        

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-teal-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Export as CSV</h2>
          <p className="text-gray-600 text-lg">
            Do you want to export all the selected data to a .csv file?
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <label className="text-lg font-medium">Fields</label>
          <div className="max-h-48 overflow-y-auto p-4 border border-gray-200 rounded-xl">
            <div className="flex flex-wrap gap-2">
              {selectedFields.map(field => (
                <div key={field} 
                  className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                  <span className="text-gray-700">{field}</span>
                  <button
                    onClick={() => handleFieldToggle(field)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="relative" ref={fieldButtonRef}>
                <button
                  onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                >
                  <span>Field</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isFieldDropdownOpen && (
                  <div 
                    ref={dropdownRef}
                    className="absolute z-50 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
                    style={{
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="py-1">
                      {availableFields.map(field => (
                        <button
                          key={field}
                          onClick={() => {
                            handleFieldToggle(field);
                            setIsFieldDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 disabled:text-gray-400 disabled:bg-gray-50/50"
                          disabled={selectedFields.includes(field)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{field}</span>
                            {selectedFields.includes(field) && (
                              <Check className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="w-full px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 font-medium"
          >
            Sure, export
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;