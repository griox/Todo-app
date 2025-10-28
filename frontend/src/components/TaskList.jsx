import React from 'react'

import TaskCard from './TaskCard';
import TaskEmptyTask from './TaskEmptyTask';
const TaskList = ({tasks,filter, handleTaskChange}) => {
  if(!tasks || tasks.length ===0){
    return <><TaskEmptyTask filter = {filter}/></>
  }
  return (
    <div className='space-y-3'>
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id ?? index}
          task={task}
          index={index}
          handleTaskChange={handleTaskChange}
        />
      ))}
    </div>

  )
}

export default TaskList
