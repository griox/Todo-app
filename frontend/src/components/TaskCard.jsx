import React, { useState } from 'react'
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Calendar, CheckCircle, CheckCircle2, Circle, SquarePen, Trash } from 'lucide-react';

const TaskCard = ({task,index, handleTaskChange}) => { 
    const [isEditing, setIsEditing] = React.useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(task.title || '');
    const deleteTask = async (taskId) => {
      try{
        await api.delete(`/tasks/${taskId}`);
        toast.success('Task deleted successfully');
        handleTaskChange()
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task. Please try again later.');
      }
    }
    const handleKeyPress = async (e) => {
      if (e.key === 'Enter') {
        updateTask();
      }
    };
    
    const updateTask = async () => {
      try{
        setIsEditing(false);
        await api.put(`/tasks/${task._id}`, {
          title: updatedTitle,
        });
        toast.success('Task updated successfully');
        handleTaskChange()
      } catch (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task. Please try again later.');
      }
    }
    const toggleTaskStatus = async () => {
      try{
        if(task.status === "pending"){
          await api.put(`/tasks/${task._id}`, {
            status: "completed",
            completedAt: new Date().toISOString(),
          });
          toast.success(`Task ${task.title} marked as completed`);
          handleTaskChange();
        }
      } catch (error) {
          console.error('Error updating task status:', error);
          toast.error('Failed to update task status. Please try again later.');
        }
    } 
  return (
     <Card className={cn('p-4 bg-gradient-card border-0 hover:shadow-custom-lg transition-all duration-200 animate-fade-in group',
      task.status === "completed" && "opacity-60"
     )}
     style = {{animationDelay: `${index * 50}ms`}}
     >
    <div className='flex items-center gap-4'>
        <Button
        onClick={toggleTaskStatus}
        variant="ghost"
        size='icon'
        className = {cn(
          "flex-shrink-0 size-8 rounded-full transition-all duration-200",
          task.status === "completed"
          ? "text-success-foreground hover:text-success/80"
          : "text-muted-foreground hover:text-primary"
        )}>
          {task.status === "completed" ? (
            <CheckCircle2 className='size-5' />
          ) : (
            <Circle className='size-5' />
          )}

      </Button>
      <div className='flex-1 min-w-0'>
        {isEditing ? (
          <Input
            type="text"
            defaultValue={task.title}
            className='flex-1 h-12 text-base border-border-50/50 focus:ring-primary/20'
            placeholder='Edit task title...'
            value ={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={()=> {
              setIsEditing(false);
              setUpdatedTitle(task.title || '');
            }}
          />
        ) : (
          <p className={cn(
            'text-base transition-all duration-200',
            task.status === "completed" ? "line-through" : "text-muted-foreground"
          )}>
            {task.title}
          </p>
        )}
           <div className='flex items-center gap-2 mt-1'>
          <Calendar className='size-3 text-muted-foreground'></Calendar>
          <span className='text-xs text-muted-foreground'>
            Due {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {task.completedAt && (
            <>
            <span className='text-xs text-muted-foreground'> - </span>
            <Calendar className='size-3 text-muted-foreground'></Calendar>
            <span className='text-xs text-muted-foreground'>
              {new Date(task.completedAt).toLocaleDateString()}
            </span>
          
            </>
          )}
      </div>
      </div>
        <div className='hidden gap-2 group-hover:inline-flex animate-slide-up'>
          <Button
            variant='ghost'
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditing(true)
              setUpdatedTitle(task.title || '')
            }}
          >
            <SquarePen className='size-4' />
          </Button>
          <Button
            variant='ghost'
            size="icon"
            onClick={() => deleteTask(task._id)}
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
          >
            <Trash className='size-4' />
          </Button>
        </div>
      </div>
     
     </Card>
  )
}

export default TaskCard
