import React from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'
const AddTask = ({handleAddTask}) => {
  const [taskTitle, setTaskTitle] = React.useState("");
  const addTask = async () => {
    if(taskTitle.trim()){
      try {
      const response = await api.post('/tasks', {
        title: taskTitle.trim(),
      });
      console.log('Task added:', response.data);
      handleAddTask();
      toast.success('Task  added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again later.');
    }
      setTaskTitle("");
    } else {
      toast.error('Task title cannot be empty.');
      return;
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  }

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg" > 
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Input onKeyPress = {handleKeyPress} value={taskTitle}  onChange={(e) => setTaskTitle(e.target.value)} type="text" placeholder="Task title" className='h-12 text-base bg-slate-50 border-border/50 sm:flex-1 focus:border-primary/50 focus:ring-primary/20 ' />
         <Button disabled={!taskTitle.trim()} onClick={addTask} variant="gradient" size="xl" className="px-6" >
        <Plus className='size-5'/> Add task
      </Button>
      </div>
     
    </Card>
  )
}
export default AddTask
