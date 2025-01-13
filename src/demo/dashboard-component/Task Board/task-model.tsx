import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/base/dialog';
import { Button } from '@/components/ui/base/button';
import { Textarea } from '@/components/ui/base/textarea';
import { Badge } from '@/components/ui/base/badge';
import { X, Plus, User, Calendar, Flag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import { Input } from '@/components/ui/Input';
import { cn } from '@/components/lib/utils';

// Define interfaces for the component
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

type Priority = 'Low' | 'Medium' | 'High';

interface Task {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: Priority;
  date: string;
  category: string;
  progress: number;
  team: string[];
  starred: boolean;
  tags: string[];
  subtasks: Subtask[];
  createdAt?: string;
}

interface TaskModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  addNewTask: (task: Task) => void;
  categories: Array<{ id: string; name: string }>;
}

const priorityColors = {
  Low: 'bg-blue-50 text-blue-700',
  Medium: 'bg-yellow-50 text-yellow-700',
  High: 'bg-red-50 text-red-700'
};

const TaskModal = ({ showModal, setShowModal, addNewTask, categories }: TaskModalProps) => {
  const initialTaskState: Task = {
    id: crypto.randomUUID(),
    icon: '📝',
    title: '',
    description: '',
    type: '',
    status: 'Todo',
    priority: 'Medium',
    date: new Date().toISOString().split('T')[0],
    category: '',
    progress: 0,
    team: [],
    starred: false,
    tags: [],
    subtasks: []
  };

  const [newTask, setNewTask] = useState<Task>(initialTaskState);
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [newTeamMember, setNewTeamMember] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!newTask.title.trim()) errors.title = 'Title is required';
    if (!newTask.description.trim()) errors.description = 'Description is required';
    if (!newTask.category) errors.category = 'Category is required';
    if (!newTask.date) errors.date = 'Due date is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newTask.tags.includes(newTag.trim())) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setNewTask({
        ...newTask,
        subtasks: [
          ...newTask.subtasks,
          {
            id: crypto.randomUUID(),
            title: newSubtask.trim(),
            completed: false
          }
        ]
      });
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setNewTask({
      ...newTask,
      subtasks: newTask.subtasks.filter(st => st.id !== subtaskId)
    });
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.trim() && !newTask.team.includes(newTeamMember.trim())) {
      setNewTask({
        ...newTask,
        team: [...newTask.team, newTeamMember.trim()]
      });
      setNewTeamMember('');
    }
  };

  const handleRemoveTeamMember = (member: string) => {
    setNewTask({
      ...newTask,
      team: newTask.team.filter(m => m !== member)
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addNewTask({
        ...newTask,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      });
      setNewTask(initialTaskState);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setNewTask(initialTaskState);
    setValidationErrors({});
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
          <DialogDescription className="text-gray-500">
            Fill in the details below to create a new task
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Title</label>
            <Input
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) => {
                setNewTask({ ...newTask, title: e.target.value });
                if (validationErrors.title) {
                  setValidationErrors({ ...validationErrors, title: '' });
                }
              }}
              className={cn(
                "w-full",
                validationErrors.title && "border-red-500 focus:ring-red-500"
              )}
              id={''}
            />
            {validationErrors.title && (
              <p className="text-sm text-red-500">{validationErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) => {
                setNewTask({ ...newTask, description: e.target.value });
                if (validationErrors.description) {
                  setValidationErrors({ ...validationErrors, description: '' });
                }
              }}
              className={cn(
                "min-h-[100px]",
                validationErrors.description && "border-red-500 focus:ring-red-500"
              )}
            />
            {validationErrors.description && (
              <p className="text-sm text-red-500">{validationErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={newTask.category}
                onValueChange={(value) => {
                  setNewTask({ ...newTask, category: value });
                  if (validationErrors.category) {
                    setValidationErrors({ ...validationErrors, category: '' });
                  }
                }}
              >
                <SelectTrigger className={cn(
                  validationErrors.category && "border-red-500 focus:ring-red-500"
                )}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {validationErrors.category && (
                <p className="text-sm text-red-500">{validationErrors.category}</p>
              )}
            </div>

            <div className="space-y-2">
        <label className="text-sm font-medium">Priority</label>
        <Select
          value={newTask.priority}
          onValueChange={(value: Priority) => setNewTask({ ...newTask, priority: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Priority Level</SelectLabel>
              <SelectItem value="Low">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-blue-500" />
                  <span>Low Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="Medium">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-yellow-500" />
                  <span>Medium Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="High">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-red-500" />
                  <span>High Priority</span>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="date"
                value={newTask.date}
                onChange={(e) => {
                  setNewTask({ ...newTask, date: e.target.value });
                  if (validationErrors.date) {
                    setValidationErrors({ ...validationErrors, date: '' });
                  }
                }}
                className={cn(
                  "pl-10",
                  validationErrors.date && "border-red-500 focus:ring-red-500"
                )}
                id={''}
              />
            </div>
            {validationErrors.date && (
              <p className="text-sm text-red-500">{validationErrors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1"
                id={''}
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {newTask.subtasks.map((subtask: Subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm">{subtask.title}</span>
                  <X
                    className="h-4 w-4 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Team Members</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add team member"
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTeamMember()}
                className="flex-1"
                id={''}
              />
              <Button 
                type="button" 
                onClick={handleAddTeamMember}
                size="sm"
                variant="outline"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newTask.team.map(member => (
                <Badge
                  key={member}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <User className="h-3 w-3" />
                  {member}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveTeamMember(member)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subtasks</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                className="flex-1"
                id={''}
              />
              <Button 
                type="button" 
                onClick={handleAddSubtask}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {newTask.subtasks.map(subtask => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm">{subtask.title}</span>
                  <X
                    className="h-4 w-4 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

          <DialogFooter className="flex-shrink-0 gap-2 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;