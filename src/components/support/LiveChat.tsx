// components/support/LiveChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/base/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/base/avatar";
import { Button } from "@/components/ui/base/button";
import { Card, CardContent } from "@/components/ui/base/card";
import { 
  Paperclip, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Search, 
  X, 
  Info, 
  User 
} from 'lucide-react';
import { Badge } from "@/components/ui/base/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/base/popover";
import { Input } from '../ui/Input';

// Enhanced interfaces with more detailed typing
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  attachments?: string[]; // Optional attachments
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
}

interface Chat {
  id: string;
  customer: ChatUser;
  agent?: ChatUser;
  status: 'active' | 'pending' | 'closed' | 'awaiting-response';
  messages: Message[];
  lastActivity: Date;
  department?: string;
  priority?: 'low' | 'medium' | 'high';
}

const LiveChat: React.FC = () => {
  // State management with more comprehensive types
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample initial data (would be replaced with actual data fetching)
  const createChat = (id: string, customerName: string, agentName: string, department: string, priority: string): Chat => ({
    id,
    customer: {
      id: `USR-${id}`,
      name: customerName,
      status: "online",
      avatar: "/placeholder-avatar.png",
    },
    agent: {
      id: `AGT-${id}`,
      name: agentName,
      status: "online",
    },
    status: "active",
    messages: [
      {
        id: "1",
        content: "Hello, I need help with my booking",
        sender: "user",
        timestamp: new Date(),
        status: "delivered",
      },
    ],
    lastActivity: new Date(),
    department,
    priority,
  });
  
  useEffect(() => {
    const initialChats: Chat[] = [
      createChat("001", "John Doe", "Support Agent", "Customer Support", "high"),
      createChat("002", "Jane Smith", "Agent Anna", "Technical Support", "medium"),
      createChat("003", "Alice Johnson", "Agent Bob", "Billing", "low"),
      createChat("004", "Mark Lee", "Agent Clara", "Customer Support", "high"),
      // Add more sample chats as needed
    ];
  
    setChats(initialChats);
  }, []);

  // Advanced message sending logic
  const sendMessage = () => {
    if (!activeChat || (!message.trim() && attachments.length === 0)) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      content: message,
      sender: 'agent',
      timestamp: new Date(),
      status: 'sent',
      attachments: attachments.map(file => file.name)
    };

    // Update the active chat with new message
    const updatedChats = chats.map(chat => 
      chat.id === activeChat.id 
        ? {
            ...chat, 
            messages: [...chat.messages, newMessage],
            lastActivity: new Date()
          }
        : chat
    );

    setChats(updatedChats);
    setActiveChat(updatedChats.find(chat => chat.id === activeChat.id) || null);
    
    // Reset message and attachments
    setMessage('');
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // File attachment handling
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(Array.from(files));
    }
  };

  // Chat filtering
  const filteredChats = chats.filter(chat => 
    chat.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      {/* Chat List Sidebar */}
      <div className="w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
                          placeholder="Search chats..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)} id={''}            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b 
                ${activeChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
              onClick={() => setActiveChat(chat)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={chat.customer.avatar} alt={chat.customer.name} />
                    <AvatarFallback>{chat.customer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{chat.customer.name}</span>
                      <Badge 
                        variant={
                          chat.priority === 'high' ? 'destructive' : 
                          chat.priority === 'medium' ? 'warning' : 'secondary'
                        }
                      >
                        {chat.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                      {chat.messages[chat.messages.length - 1]?.content}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {chat.lastActivity.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activeChat.customer.avatar} alt={activeChat.customer.name} />
                  <AvatarFallback>{activeChat.customer.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{activeChat.customer.name}</h3>
                  <p className="text-sm text-gray-500">
                    {activeChat.department} • {activeChat.customer.status}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon">
                  <Phone size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video size={20} />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info size={20} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Customer Details</h4>
                        <p className="text-sm text-gray-500">Additional information about the customer</p>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-gray-500" />
                          <span>{activeChat.customer.name}</span>
                        </div>
                        {/* Add more customer details here */}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Message Area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-800">
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.sender === 'agent' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <Card className={`max-w-[70%] ${
                    msg.sender === 'agent' 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'bg-white dark:bg-gray-700'
                  }`}>
                    <CardContent className="p-3">
                      <p>{msg.content}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                          {msg.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center">
                              <Paperclip size={16} className="mr-2" />
                              {attachment}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        {msg.status === 'failed' && (
                          <span className="text-xs text-red-500">Failed</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </ScrollArea>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="p-2 bg-gray-100 dark:bg-gray-700 flex items-center space-x-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center bg-white dark:bg-gray-800 p-2 rounded">
                    <Paperclip size={16} className="mr-2" />
                    <span className="text-sm">{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2"
                      onClick={() => {
                        const newAttachments = attachments.filter((_, i) => i !== index);
                        setAttachments(newAttachments);
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t bg-white dark:bg-gray-900">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip />
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple 
                  onChange={handleFileAttachment}
                />
                <Input
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Type your message..."
                                  className="flex-1"
                                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()} id={''}                />
                <Button onClick={sendMessage}>
                  <Send className="mr-2" size={16} /> Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;