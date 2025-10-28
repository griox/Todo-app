import { Circle } from 'lucide-react'
import React from 'react'
import { Card } from './ui/card';
const TaskEmptyTask = ({ filter }) => {
  return (
    <Card
    className ='p-8 text-center border-0 bg-gradient-card shadow-custom-md'
    >
      <div className='space-y-3'>
        <Circle className='mx-auto size-12 text-muted-foreground'></Circle>
      </div>
      <h3 className='font-medium text-foreground'>
        {
          filter === "pending" ? "No pending tasks" :
          filter === "completed" ? "No completed tasks" :
          "No tasks available"
        }
      </h3>
      <p className='text-muted-foreground text-sm'>
        {filter ==="all" ? "Adding first task to begin" : `Move to "all" mode to see all tasks ${filter === "pending" ? "you have completed" : "to be done" }.`}
      </p>
    </Card>
  )
}

export default TaskEmptyTask
