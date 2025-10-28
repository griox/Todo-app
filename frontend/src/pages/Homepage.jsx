import React, { useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import AddTask from '@/components/AddTask'
import StatsandFilter from '@/components/StatsandFilter'
import TaskList from '@/components/TaskList'
import TaskPagination from '@/components/TaskPagination'
import DateTimeFilter from '@/components/DateTimeFilter' // đảm bảo file tồn tại và đúng chữ hoa/thường
import Header from '@/components/Header'
import { toast } from 'sonner'
import axios from 'axios'
const Homepage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("all");

  useEffect(() => {
    fetchData();
  }, [dateQuery]);
  // Fetch tasks from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/tasks?filter=${dateQuery}`);
      console.log('Fetched tasks:', response.data);
      setTaskBuffer(response.data.tasks);
      setPendingCount(response.data.pendingCount);
      setCompletedCount(response.data.completedCount);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again later.');
    }
  };
  // save filtered tasks
  const filteredTasks = taskBuffer.filter((task) => {
   switch (filter) {
     case 'pending':
       return task.status === 'pending';
     case 'completed':
       return task.status === 'completed';
     default:
       return true;
   }
  });
  const handleTaskChange = () => {
    fetchData();
  } 

  return (
    <div className="min-h-screen w-full bg-[#faf9f6] relative">
      {/* Paper Texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
          `,
          backgroundSize: '8px 8px, 32px 32px, 32px 32px',
        }}
      />
      <div className="container pt-8 p-6 mx-auto relative z-10">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <Header />
          <AddTask handleAddTask={handleTaskChange} />
          <StatsandFilter
            filter={filter}
            setFilter={setFilter}
           pendingCount={pendingCount} completedCount={completedCount} />
          <TaskList handleTaskChange={handleTaskChange} tasks={filteredTasks} filter={filter} />
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskPagination />
            <DateTimeFilter setDateQuery={setDateQuery} dateQuery={dateQuery} />
          </div>
          <Footer completedCount={completedCount} pendingCount={pendingCount} />
        </div>
      </div>
    </div>
  )
}

export default Homepage
