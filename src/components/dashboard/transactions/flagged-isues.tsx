import React, { useState, useMemo } from 'react';
import { Search, User, X, CheckCircle } from 'lucide-react';

// Initial issues data with more detailed information
const initialIssues = [
  {
    id: 1,
    title: 'Check In Issue',
    description: '@Alexa shared a message regarding check in issue',
    time: 'Just Now',
    avatar: null,
    status: 'pending',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Check In Issue',
    description: '@Alexa shared a message regarding check in issue',
    time: '11:16 AM',
    avatar: null,
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Check In Issue',
    description: '@Alexa shared a message regarding check in issue',
    time: '09:00 AM',
    avatar: null,
    status: 'pending',
    priority: 'low'
  },
  {
    id: 4,
    title: 'Robert Fox Feedback',
    description: '"It was an amazing experience with your organisation"',
    time: 'Yesterday',
    avatar: null,
    status: 'resolved',
    priority: 'low'
  },
  {
    id: 5,
    title: 'Password Update',
    description: 'Your password has been updated successfully',
    time: 'Yesterday',
    avatar: null,
    status: 'resolved',
    priority: 'low'
  },
];

const FlaggedIssuesPage: React.FC = () => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [issues, setIssues] = useState(initialIssues);

  // Filtering and searching logic
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filter === 'all' || issue.status === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [issues, searchTerm, filter]);

  // Handle issue status change
  const updateIssueStatus = (id: number, newStatus: string) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === id ? { ...issue, status: newStatus } : issue
      )
    );
  };

  // Remove issue
  const removeIssue = (id: number) => {
    setIssues(prevIssues => prevIssues.filter(issue => issue.id !== id));
  };

  return (
    <main className=" bg-gray-50">
      <div className="container  ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Flagged Issues</h1>
            <p className="text-sm text-gray-500">All issues provided by users</p>
          </div>
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search issues"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            
            {/* Filter Dropdown */}
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Issues</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No issues found
            </div>
          ) : (
            filteredIssues.map((issue, index) => (
              <div
                key={issue.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  index < filteredIssues.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Avatar or Placeholder */}
                  {issue.avatar ? (
                    <img
                      src={issue.avatar}
                      alt={issue.title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}

                  {/* Issue Details */}
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-800">{issue.title}</h3>
                      {/* Status Badge */}
                      <span 
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          issue.status === 'resolved' ? 'bg-green-100 text-green-800' : ''
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{issue.description}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* Time */}
                  <span className="text-xs text-gray-400 mr-4">{issue.time}</span>
                  
                  {/* Status Change Buttons */}
                  {issue.status !== 'resolved' && (
                    <button 
                      onClick={() => updateIssueStatus(issue.id, 'resolved')}
                      className="text-green-500 hover:bg-green-100 p-1 rounded-full"
                      title="Mark as Resolved"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => removeIssue(issue.id)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded-full"
                    title="Remove Issue"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default FlaggedIssuesPage;